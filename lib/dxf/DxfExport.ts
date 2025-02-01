import { PaperDimensions } from "../opencv/PaperSettings";
import ContourPoints from "../data/contour/ContourPoints";
import Point from "../data/Point";

const HEADER = `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n`;
const SECTION_ENTITIES = `0\nSECTION\n2\nENTITIES\n`;
const END_OF_FILE = `0\nENDSEC\n0\nEOF`;

const fromContours = (
  contours: ContourPoints[],
  paperDimensions: PaperDimensions
): string => {
  let dxf = HEADER;
  dxf += SECTION_ENTITIES;

  contours.forEach(({ points }) => {
    dxf += polyLineOf(points, paperDimensions);
  });

  dxf += END_OF_FILE;
  return dxf;
};

const polyLineOf = (points: Point[], paperDimensions: PaperDimensions) => {
  let dxf = `0\nLWPOLYLINE\n8\n0\n90\n${points.length}\n`;
  points.forEach((point) => {
    dxf += dxfPointOf(point, paperDimensions);
  });
  dxf += dxfPointOf(points[0], paperDimensions);
  return dxf;
};

const dxfPointOf = (point: Point, paperDimensions: PaperDimensions) => {
  const { x, y } = point;
  return `10\n${x}\n20\n${paperDimensions.height - y}\n`;
};

export default fromContours;
