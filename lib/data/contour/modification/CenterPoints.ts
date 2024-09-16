import { PaperDimensions } from "@/lib/opencv/PaperSettings";
import ContourPoints from "../ContourPoints";

const _centerPoints = (contour: ContourPoints) => {
  return (paperDimensions: PaperDimensions): ContourPoints => {
    const translateX = paperDimensions.width / 2;
    const translateY = paperDimensions.height / 2;
    return {
      points: contour.points.map((point) => {
        return { x: point.x - translateX, y: point.y - translateY };
      }),
    };
  };
};

export default _centerPoints;
