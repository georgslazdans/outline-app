"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import MeasureReadout from "./MeasureReadout";
import { Dictionary } from "@/app/dictionaries";
import Point, { lengthOf } from "@/lib/data/Point";
import ContourPoints from "@/lib/data/contour/ContourPoints";
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
  dictionary: Dictionary;
  pxPerMm?: number;
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

const isSamePoint = (a: Point, b: Point) => lengthOf(a, b) < 1;

const MeasureOverlay = ({
  canvasWidth,
  canvasHeight,
  contours,
  dictionary,
  pxPerMm,
  onExit,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerDown = useRef<{ x: number; y: number } | undefined>();
  const [candidate, setCandidate] = useState<MeasureCandidate | undefined>();
  const [pointA, setPointA] = useState<Point | undefined>();
  const [pointB, setPointB] = useState<Point | undefined>();
  // On-screen size of one image pixel (accounts for fit-to-box + zoom), used to
  // keep marker sizes constant on screen regardless of zoom level.
  const [screenScale, setScreenScale] = useState(1);
  // Zoom/pan factor applied by react-zoom-pan-pinch. Unlike screenScale it does
  // not include the fit-to-box downscale, so it is what plain HTML inside the
  // transformed content has to be divided by to keep a constant screen size.
  const [zoomScale, setZoomScale] = useState(1);
  const core = useTransformContext();

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
      setZoomScale(core.transformState.scale);
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

  // The measurement is tied to the geometry it was taken on: clear it (and any
  // in-progress pick) whenever the outline points change identity.
  useEffect(() => {
    setPointA(undefined);
    setPointB(undefined);
  }, [contours]);

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
      pick(resolved.point);
    }
  };

  // First click sets A, second sets B, a third one starts over on A. Picking
  // the very same point twice is a no-op: the distance would be meaningless.
  const pick = (point: Point) => {
    if (!pointA) {
      setPointA(point);
    } else if (!pointB) {
      if (!isSamePoint(point, pointA)) {
        setPointB(point);
      }
    } else {
      setPointA(point);
      setPointB(undefined);
    }
  };

  const measurement =
    pointA && pointB
      ? formatMeasurementForDisplay(distancePx(pointA, pointB), pxPerMm)
      : undefined;

  const hint = !measurement
    ? pointA
      ? dictionary.calibration.measure.pickSecond
      : dictionary.calibration.measure.pickFirst
    : undefined;

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

  return (
    <>
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
      </svg>

      {/* The readout floats on the image, so it lives inside the transformed
          content and has to be counter-scaled by the zoom factor to keep a
          constant screen size at any zoom level. Scaling about `bottom center`
          keeps the chip centred and pinned to the bottom edge, and the padding
          inside the scaled box keeps the gap to the edge constant too. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
      >
        <div
          className="pb-2"
          style={{
            transform: `scale(${1 / zoomScale})`,
            transformOrigin: "bottom center",
          }}
        >
          <MeasureReadout
            dictionary={dictionary}
            measurement={measurement}
            hint={hint}
          ></MeasureReadout>
        </div>
      </div>
    </>
  );
};

export default MeasureOverlay;
