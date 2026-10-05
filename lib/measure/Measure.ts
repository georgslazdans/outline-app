import Point, { lengthOf } from "@/lib/data/Point";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { closestPointOnSegment } from "@/lib/data/line/ClosestPointOnSegment";

/**
 * A point on a contour that the measure tool can snap to.
 * `isVertex` is true when the point is a real contour vertex (either a vertex
 * snap while holding Ctrl, or an interpolated projection that clamped onto a
 * segment endpoint); false when it is interpolated in the middle of a segment.
 */
export type MeasureCandidate = {
  point: Point;
  isVertex: boolean;
};

/**
 * Flat coordinate cache for a whole contour set, so hit-testing on pointermove
 * does not re-walk the nested `ContourPoints[]` structure or allocate a Point
 * per vertex. Object contours hold thousands of vertices.
 */
type ContourCache = {
  xs: Float64Array;
  ys: Float64Array;
  /** start offset of each polyline inside xs/ys */
  starts: number[];
  /** point count of each polyline */
  counts: number[];
};

const cacheByContourSet = new WeakMap<ContourPoints[], ContourCache>();

const cacheFor = (contours: ContourPoints[]): ContourCache => {
  const cached = cacheByContourSet.get(contours);
  if (cached) {
    return cached;
  }

  let total = 0;
  for (const contour of contours) {
    total += contour.points.length;
  }

  const xs = new Float64Array(total);
  const ys = new Float64Array(total);
  const starts: number[] = [];
  const counts: number[] = [];

  let offset = 0;
  for (const contour of contours) {
    starts.push(offset);
    counts.push(contour.points.length);
    for (const point of contour.points) {
      xs[offset] = point.x;
      ys[offset] = point.y;
      offset++;
    }
  }

  const cache: ContourCache = { xs, ys, starts, counts };
  cacheByContourSet.set(contours, cache);
  return cache;
};

/**
 * Resolves the point the measure tool should highlight/click for a raw pointer
 * position, searching every polyline in `contours` (each treated as a closed
 * loop).
 *
 * - default (`snapToVertices` false): the closest point *on* any segment
 *   (clamped projection), interpolated along the segment;
 * - `snapToVertices` true (Ctrl held): the nearest actual contour vertex.
 *
 * Returns `undefined` when nothing is within `maxDistance` (screen px) of the
 * raw point. Distances are compared as squares to avoid `sqrt` in the hot loop.
 */
export const candidateFor = (
  rawPoint: Point,
  contours: ContourPoints[],
  maxDistance: number,
  snapToVertices: boolean
): MeasureCandidate | undefined => {
  if (!contours || contours.length === 0) {
    return undefined;
  }

  const { xs, ys, starts, counts } = cacheFor(contours);
  const maxDistanceSq = maxDistance * maxDistance;

  if (snapToVertices) {
    let bestSq = Infinity;
    let bestX = 0;
    let bestY = 0;
    for (let i = 0; i < xs.length; i++) {
      const dx = xs[i] - rawPoint.x;
      const dy = ys[i] - rawPoint.y;
      const sq = dx * dx + dy * dy;
      if (sq < bestSq) {
        bestSq = sq;
        bestX = xs[i];
        bestY = ys[i];
      }
    }
    if (xs.length > 0 && bestSq <= maxDistanceSq) {
      return { point: { x: bestX, y: bestY }, isVertex: true };
    }
    return undefined;
  }

  let bestSq = Infinity;
  let best: MeasureCandidate | undefined;
  // Reused scratch endpoints so the projection does not allocate per segment.
  const a = { x: 0, y: 0 };
  const b = { x: 0, y: 0 };

  for (let c = 0; c < starts.length; c++) {
    const start = starts[c];
    const count = counts[c];
    if (count < 2) {
      continue;
    }
    for (let i = 0; i < count; i++) {
      const ia = start + i;
      const ib = start + ((i + 1) % count);
      a.x = xs[ia];
      a.y = ys[ia];
      b.x = xs[ib];
      b.y = ys[ib];

      const projected = closestPointOnSegment(rawPoint, a, b);
      const dx = projected.point.x - rawPoint.x;
      const dy = projected.point.y - rawPoint.y;
      const sq = dx * dx + dy * dy;
      if (sq < bestSq) {
        bestSq = sq;
        best = { point: projected.point, isVertex: projected.isEndpoint };
      }
    }
  }

  if (best && bestSq <= maxDistanceSq) {
    return best;
  }
  return undefined;
};

/** Straight-line distance between two points, in image pixels. */
export const distancePx = (a: Point, b: Point): number => lengthOf(a, b);

/**
 * Formats a pixel distance for display. When a `pxPerMm` scale is available the
 * value is converted to millimetres with one decimal (`"42.5 mm"`); otherwise it
 * falls back to whole pixels (`"128 px"`). The unit is always printed so the
 * difference is visible.
 */
export const formatMeasurement = (
  distancePx: number,
  pxPerMm: number | undefined
): string => {
  if (pxPerMm && pxPerMm > 0) {
    return `${(distancePx / pxPerMm).toFixed(1)} mm`;
  }
  return `${Math.round(distancePx)} px`;
};
