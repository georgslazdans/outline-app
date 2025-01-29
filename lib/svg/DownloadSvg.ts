import ContourPoints, {
  ContourOutline,
  modifyContourList,
} from "../data/contour/ContourPoints";
import { downloadFile } from "../utils/Download";
import Svg from "./Svg";
import { PaperDimensions } from "../opencv/PaperSettings";
import JsZip from "jszip";

export const downloadAsSvg = (
  contourOutlines: ContourOutline[],
  paperDimensions: PaperDimensions
) => {
  if (contourOutlines.length == 1) {
    const blob = asXmlFile(contourOutlines[0], paperDimensions);
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  } else {
    const blobs = contourOutlines.map((it) => asXmlFile(it, paperDimensions));
    asZipFile(blobs).then((zip) =>
      downloadFile(zip, `outline-${new Date().toLocaleDateString("lv")}.zip`)
    );
  }
};

const asXmlFile = (
  outline: ContourOutline,
  paperDimensions: PaperDimensions
) => {
  const points = pointsOf(outline);
  const contours = modifyContourList(points).centerPoints(paperDimensions);
  const svg = Svg.from(contours, paperDimensions);
  return new Blob([svg], {
    type: "image/svg+xml",
  });
};

const pointsOf = (outline: ContourOutline): ContourPoints[] => {
  const holes = outline.holes ? outline.holes : [];
  return [outline.outline, ...holes];
};

const asZipFile = (blobs: Blob[]): Promise<Blob> => {
  var zip = new JsZip();
  blobs.forEach((blob, index) => zip.file(`outline-${index}.svg`, blob));
  return zip.generateAsync({ type: "blob" });
};
