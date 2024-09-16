import ContourPoints from "../ContourPoints";
import { nextIndex } from "../../line/PointIndex";


const _arePointsClockwise = (contour: ContourPoints) => {
  return (): boolean => {
    const { points } = contour;
    let sum = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const current = points[i];
      const next = points[nextIndex(i, n)];
      sum += current.x * next.y - next.x * current.y;
    }

    // If sum is positive, it's clockwise; if negative, it's counterclockwise
    return sum > 0;
  };
};

export default _arePointsClockwise;
