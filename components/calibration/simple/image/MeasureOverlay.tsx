"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import Point from "@/lib/data/Point";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { useResultContext } from "../../ResultContext";
import { useDetails } from "@/context/DetailsContext";
import { applyDefaults, defaultSettings } from "@/lib/opencv/Settings";
import { pxPerMmFor } from "@/lib/measure/PaperScale";
import {
  candidateFor,
  distancePx,
  formatMeasurementForDisplay,
  MeasureCandidate,
} from "@/lib/measure/Measure";

type Props = {
  canvasWidth: number;
  canvasHeight: number;
  contours: ContourPoints[];
  /** Picked endpoints, owned by the viewer's measure session. */
  pointA?: Point;
  pointB?: Point;
  /** A pointer landed on the contour: the session rotates A/B. */
  onPick: (point: Point) => void;
  /** Measure mode was left (Escape): the viewer turns the mode off. */
  onExit: () => void;
};

// Hit radius, in screen pixels, within which a pointer snaps to the contour.
const SNAP_RADIUS_SCREEN_PX = 12;
// Upper bound on rendered vertex handles: dense contours (thousands of points)
// are sampled down to roughly this many circles so the view stays readable
// while the E2E test (and the user) still has stable points to target.
const MAX_RENDERED_VERTICES = 64;
// A pointer that travelled more than this many screen pixels between down and
// up was a pan-drag, not a pick-click: the pick is ignored (panning stays
// enabled in measure mode, so drags move the content).
const DRAG_THRESHOLD_SCREEN_PX = 4;

const MeasureOverlay = ({
  canvasWidth,
  canvasHeight,
  contours,
  pointA,
  pointB,
  onPick,
  onExit,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerDown = useRef<{ x: number; y: number } | undefined>();
  const [candidate, setCandidate] = useState<MeasureCandidate | undefined>();
  // On-screen size of one image pixel (accounts for fit-to-box + zoom), used to
  // keep marker sizes constant on screen regardless of zoom level.
  const [screenScale, setScreenScale] = useState(1);
  const core = useTransformContext();

  const { stepResults } = useResultContext();
  const { detailsContext } = useDetails();
  // Pixels per millimetre of the displayed image, normalised the same way the
  // calibration page does so stored details behave identically. Undefined when
  // the paper scale is unknown, and the readout falls back to pixels.
  const pxPerMm = useMemo(
    () =>
      pxPerMmFor({
        stepResults,
        settings: applyDefaults(defaultSettings(), detailsContext.settings),
      }),
    [stepResults, detailsContext.settings]
  );

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || canvasWidth === 0) {
      return;
    }
    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0) {
        setScreenScale(rect.width / canvasWidth);
      }
    };
    measure();
    // The zoom/pan state lives on the (mutable) context instance and does not
    // re-render consumers, so re-measure whenever the transform changes.
    const unsubscribe = core.onChange(measure);
    window.addEventListener("resize", measure);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", measure);
    };
  }, [core, canvasWidth]);

  // Escape leaves measure mode. The overlay does not own the mode, so it asks
  // the viewer to turn it off instead of unwinding its own state here.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  const resolve = (clientX: number, clientY: number, ctrl: boolean) => {
    const svg = svgRef.current;
    if (!svg || canvasWidth === 0) {
      return undefined;
    }
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return undefined;
    }
    const raw: Point = {
      x: ((clientX - rect.left) / rect.width) * canvasWidth,
      y: ((clientY - rect.top) / rect.height) * canvasHeight,
    };
    const maxDistance = (SNAP_RADIUS_SCREEN_PX * canvasWidth) / rect.width;
    return candidateFor(raw, contours, maxDistance, ctrl);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    setCandidate(resolve(event.clientX, event.clientY, event.ctrlKey));
  };

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    pointerDown.current = { x: event.clientX, y: event.clientY };
  };

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    // Panning is enabled in measure mode, so a drag that moved the content
    // must not also pick a point: only treat (nearly) still clicks as picks.
    const down = pointerDown.current;
    pointerDown.current = undefined;
    if (
      down &&
      Math.hypot(event.clientX - down.x, event.clientY - down.y) >
        DRAG_THRESHOLD_SCREEN_PX
    ) {
      return;
    }
    const resolved = resolve(event.clientX, event.clientY, event.ctrlKey);
    if (resolved) {
      onPick(resolved.point);
    }
  };

  const r = (screenPx: number) => screenPx / screenScale;

  const totalVertices = contours.reduce(
    (sum, contour) => sum + contour.points.length,
    0
  );
  // Dense contours are sampled down instead of hiding the handles entirely:
  // every k-th point is rendered so up to ~MAX_RENDERED_VERTICES handles exist
  // on any outline (the paper quad, with a stride of 1, keeps all four).
  const vertexStride = Math.max(
    1,
    Math.ceil(totalVertices / MAX_RENDERED_VERTICES)
  );

  let vertexIndex = 0;

  const measurement =
    pointA && pointB
      ? formatMeasurementForDisplay(distancePx(pointA, pointB), pxPerMm)
      : undefined;

  return (
    <svg
      ref={svgRef}
      data-testid="measure-overlay"
      className="absolute inset-0 h-full w-full"
      style={{
        cursor: "crosshair",
        overflow: "visible",
        touchAction: "none",
      }}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      preserveAspectRatio="none"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={() => setCandidate(undefined)}
      onClick={handleClick}
    >
      {totalVertices > 0 &&
        contours.flatMap((contour) =>
          contour.points.map((point) => {
            const index = vertexIndex++;
            if (index % vertexStride !== 0) {
              return null;
            }
            return (
              <circle
                key={`vertex-${index}`}
                data-testid="measure-vertex"
                data-index={index}
                cx={point.x}
                cy={point.y}
                r={r(3)}
                fill="rgba(59,130,246,0.35)"
                stroke="#2563eb"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                style={{ pointerEvents: "all" }}
              />
            );
          })
        )}

      {pointA && pointB && (
        <line
          x1={pointA.x}
          y1={pointA.y}
          x2={pointB.x}
          y2={pointB.y}
          stroke="#2563eb"
          strokeWidth={2}
          strokeDasharray="6 4"
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: "none" }}
        />
      )}

      {pointA && (
        <circle
          data-testid="measure-point-a"
          cx={pointA.x}
          cy={pointA.y}
          r={r(5)}
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: "none" }}
        />
      )}

      {pointB && (
        <circle
          data-testid="measure-point-b"
          cx={pointB.x}
          cy={pointB.y}
          r={r(5)}
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: "none" }}
        />
      )}

      {candidate && (
        <circle
          data-testid="measure-candidate"
          cx={candidate.point.x}
          cy={candidate.point.y}
          r={r(6)}
          fill={candidate.isInterpolated ? "none" : "#2563eb"}
          stroke="#2563eb"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: "none" }}
        />
      )}

      {pointA &&
        pointB &&
        measurement &&
        (() => {
          const mid = {
            x: (pointA.x + pointB.x) / 2,
            y: (pointA.y + pointB.y) / 2,
          };
          return (
            <text
              data-testid="measure-inline-label"
              x={mid.x}
              y={mid.y - r(10)}
              textAnchor="middle"
              fontSize={r(14)}
              fill="#1d4ed8"
              stroke="#ffffff"
              strokeWidth={r(3)}
              paintOrder="stroke"
              style={{ fontWeight: 700, pointerEvents: "none" }}
            >
              {measurement}
            </text>
          );
        })()}
    </svg>
  );
};

export default MeasureOverlay;
