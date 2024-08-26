import ContourPoints from "../ContourPoints";

const deletePoint = (contour: ContourPoints) => {
  return (index: number): ContourPoints => {
    return {
      points: contour.points.filter((_, pointIndex) => pointIndex !== index),
    };
  };
};

export default deletePoint;
