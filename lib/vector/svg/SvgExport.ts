import ContourPoints from "@/lib/data/contour/ContourPoints";
import Point from "@/lib/data/Point";
import { PaperDimensions } from "@/lib/opencv/PaperSettings";

const fromContours = (
  contours: ContourPoints[],
  paperDimensions: PaperDimensions
): string => {
  const pathData = pathDataOf(contours);
  return `<svg xmlns="http://www.w3.org/2000/svg" ${viewPortOf(
    paperDimensions
  )}>
      ${pathData}
    </svg>`;
};

const viewPortOf = (paperDimensions: PaperDimensions) => {
  return ` width="${paperDimensions.width}mm" height="${
    paperDimensions.height
  }mm"
             viewBox="${-paperDimensions.width / 2} ${
    -paperDimensions.height / 2
  } ${paperDimensions.width} ${paperDimensions.height}" `;
};

const pathDataOf = (contours: ContourPoints[]) => {
  const pointData = contours.map((it) => pointDataOf(it.points)).join("");
  return `<path d="${pointData}" stroke-width="1" stroke="black" fill="none"/>`;
};

const pointDataOf = (points: Point[]) => {
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }
  pathData += " Z "; // Close the path
  return pathData;
};

export default fromContours;
