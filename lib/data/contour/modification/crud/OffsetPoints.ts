import Point from "@/lib/data/Point";
import ContourPoints from "../../ContourPoints";
import _addPoint from "./AddPoint";

const _offsetPoints = (contour: ContourPoints) => {
  return (offset: Point): ContourPoints => {
    const points = contour.points.map((point) => {
      return {
        x: point.x + offset.x,
        y: point.y + offset.y,
      };
    });
    return {
      points,
    };
  };
};

export default _offsetPoints;
