"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTransformContext } from "react-zoom-pan-pinch";
import Point from "@/lib/data/Point";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { candidateFor, MeasureCandidate } from "@/lib/measure/Measure";

type Props = {
  canvasWidth: number;
  canvasHeight: number;
  contours: ContourPoints[];
  pointA?: Point;
  pointB?: Point;
  measurement?: string;
  onPick: (point: Point) => void;
};

// Hit radius, in screen pixels, within which a pointer snaps to the contour.
const SNAP_RADIUS_SCREEN_PX = 12;
// Vertex hit circles are only rendered as real, clickable elements when the
// contour is sparse enough (the paper quad qualifies; dense object contours do
// not) so the E2E test has stable points to target without cluttering the view.
const MAX_RENDERED_VERTICES = 64;

const MeasureOverlay = ({
  canvasWidth,
  canvasHeight,
  contours,
  pointA,
  pointB,
  measurement,
  onPick,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [candidate, setCandidate] = useState<MeasureCandidate | undefined>();
  // On-screen size of one image pixel (accounts for fit-to-box + zoom), used to
  // keep marker sizes constant on screen regardless of zoom level.
  const [screenScale, setScreenScale] = useState(1);
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

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
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
  const renderVertices = totalVertices > 0 && totalVertices <= MAX_RENDERED_VERTICES;

  let vertexIndex = 0;

  return (
    <svg
      ref={svgRef}
      data-testid="measure-overlay"
      className="absolute inset-0 h-full w-full"
      style={{ cursor: "crosshair", overflow: "visible", touchAction: "none" }}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      preserveAspectRatio="none"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCandidate(undefined)}
      onClick={handleClick}
    >
      {renderVertices &&
        contours.flatMap((contour) =>
          contour.points.map((point) => {
            const index = vertexIndex++;
            return (
              <circle
                key={`vertex-${index}`}
                data-testid="measure-vertex"
                data-index={index}
                cx={point.x}
                cy={point.y}
                r={r(7)}
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
        />
      )}

      {candidate && (
        <circle
          data-testid="measure-candidate"
          cx={candidate.point.x}
          cy={candidate.point.y}
          r={r(6)}
          fill={candidate.isVertex ? "#2563eb" : "none"}
          stroke="#2563eb"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
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
