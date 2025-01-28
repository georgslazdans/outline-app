import {
  ContourOutline,
  modifyContourList,
} from "../data/contour/ContourPoints";
import { downloadFile } from "../utils/Download";
import Svg from "./Svg";
import { PaperDimensions } from "../opencv/PaperSettings";

export const downloadAsSvg = (
  contourOutlines: ContourOutline[],
  paperDimensions: PaperDimensions
) => {
  const contourPoints = contourOutlines.map((it) => {
    const holes = it.holes ? it.holes : [];
    return [it.outline, ...holes];
  });
  for (const points of contourPoints) {
    const contours = modifyContourList(points).centerPoints(paperDimensions);
    const svg = Svg.from(contours, paperDimensions);
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  }
};
