import Point from "./Point";

namespace Svg {
  export const from = (points: Point[]) => {
    const pathData = pathDataOf(points);
    return `<svg xmlns="http://www.w3.org/2000/svg">${pathData}</svg>`;
  };

  const pathDataOf = (points: Point[]) => {
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    pathData += " Z"; // Close the path

    return `<path d="${pathData}" stroke-width="1" stroke="black" fill="none"/>`;
  };

  const maxSize = () => {};
}

export default Svg;
