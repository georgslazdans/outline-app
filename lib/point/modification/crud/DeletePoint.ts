import ContourPoints from "../../ContourPoints";

const deletePoint = (contour: ContourPoints) => {
  return (index: number): ContourPoints | undefined => {
    const points = contour.points.filter(
      (_, pointIndex) => pointIndex !== index
    );
    if (points.length > 0) {
      return {
        points: points,
      };
    }
  };
};

export default deletePoint;
