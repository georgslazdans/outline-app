import ContourPoints from "../ContourPoints";

const _flipYPoints = (contour: ContourPoints) => {
  return (): ContourPoints => {
    return {
      points: contour.points.map((point) => {
        return { x: point.x, y: -point.y };
      }),
    };
  };
};

export default _flipYPoints;
