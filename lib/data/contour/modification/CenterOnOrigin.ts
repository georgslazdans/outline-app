import ContourPoints from "../ContourPoints";
import Point from "../../Point";

type BoundingRect = {
  topLeft: Point;
  width: number;
  height: number;
};

const _boundingRect = (contour: ContourPoints): BoundingRect => {
  const { points } = contour;
  // find the min and max x and y values
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  return {
    topLeft: { x: minX, y: minY },
    width: maxX - minX,
    height: maxY - minY,
  };
};

const _centerOnOrigin = (contour: ContourPoints) => {
  return (): ContourPoints => {
    const boundingRect = _boundingRect(contour);
    const translateX = boundingRect.topLeft.x + boundingRect.width / 2;
    const translateY = boundingRect.topLeft.y + boundingRect.height / 2;
    return {
      points: contour.points.map((point) => {
        return { x: point.x - translateX, y: point.y - translateY };
      }),
    };
  };
};

export default _centerOnOrigin;
