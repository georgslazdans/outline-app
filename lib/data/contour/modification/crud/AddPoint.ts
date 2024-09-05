import ContourPoints from "../../ContourPoints";
import Point from "../../../Point";

const addPoint = (contour: ContourPoints) => {
  return (point: Point, index?: number): ContourPoints => {

    let updatedPoints;

    if (index !== undefined && index >= 0 && index <= contour.points.length) {
      updatedPoints = [
        ...contour.points.slice(0, index),
        point,
        ...contour.points.slice(index),
      ];
    } else {
      updatedPoints = [...contour.points, point];
    }

    return {
      points: updatedPoints,
    };
  };
};

export default addPoint;
