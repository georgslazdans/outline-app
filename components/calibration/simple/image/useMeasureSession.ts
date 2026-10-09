import { useEffect, useState } from "react";
import Point, { lengthOf } from "@/lib/data/Point";
import ContourPoints from "@/lib/data/contour/ContourPoints";

const isSamePoint = (a: Point, b: Point) => lengthOf(a, b) < 1;

/**
 * Pick state for the measuring tool, shared between the viewer (which shows the
 * pick hint) and the overlay (which draws the markers). First click sets A, a
 * second sets B, a third starts over on A; re-picking the very same point is a
 * no-op, because the distance would be meaningless.
 */
export const useMeasureSession = (contours: ContourPoints[]) => {
  const [pointA, setPointA] = useState<Point | undefined>();
  const [pointB, setPointB] = useState<Point | undefined>();

  // The measurement is tied to the geometry it was taken on: clear it (and any
  // in-progress pick) whenever the outline points change identity.
  useEffect(() => {
    setPointA(undefined);
    setPointB(undefined);
  }, [contours]);

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

  return { pointA, pointB, pick };
};
