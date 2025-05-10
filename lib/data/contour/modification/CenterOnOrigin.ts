import ContourPoints from "../ContourPoints";
import Point from "../../Point";
import _findPathBounds from "../queries/FindPathBounds";

type BoundingRect = {
  topLeft: Point;
  width: number;
  height: number;
};

const _boundingRect = (contour: ContourPoints): BoundingRect => {
  const {minX, maxX, minY, maxY} = _findPathBounds(contour)()
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
