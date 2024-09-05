import ContourPoints from "../ContourPoints";

const mirrorPointsOnXAxis = (contour: ContourPoints) => {
  return (): ContourPoints => {
    return {
      points: contour.points.map((point) => {
        return { x: point.x, y: -point.y };
      }),
    };
  };
};

export default mirrorPointsOnXAxis;
