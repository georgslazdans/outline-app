import Point from "./Point";
import { ContourPoints } from "./opencv/StepResult";

namespace Svg {
  export const from = (contours: ContourPoints[]) => {
    const pathData = pathDataOf(contours);
    return `<svg xmlns="http://www.w3.org/2000/svg">${pathData}</svg>`;
  };

  const pathDataOf = (contours: ContourPoints[]) => {
    const pointData = contours.map(it=> pointDataOf(it.points)).join("");
    return `<path d="${pointData}" stroke-width="1" stroke="black" fill="none"/>`;
  };

  const pointDataOf = (points: Point[]) => {
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    pathData += " Z"; // Close the path
    return pathData;
  }

  const maxSize = () => {};
}

export default Svg;
