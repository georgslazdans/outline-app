
import ContourPoints, { ContourOutline, modifyContourList } from "@/lib/data/contour/ContourPoints";
import { PaperDimensions } from "@/lib/opencv/PaperSettings";
import { downloadFile } from "@/lib/utils/Download";
import Svg from "./Svg";
import JsZip from "jszip";

export const downloadAsSvg = (
  contourOutlines: ContourOutline[],
  paperDimensions: PaperDimensions,
  fileName: string
) => {
  if (contourOutlines.length == 1) {
    const blob = asXmlFile(contourOutlines[0], paperDimensions);
    downloadFile(blob, `${fileName}.svg`);
  } else {
    const blobs = contourOutlines.map((it) => asXmlFile(it, paperDimensions));
    asZipFile(blobs).then((zip) => downloadFile(zip, `${fileName}_svg.zip`));
  }
};

const asXmlFile = (
  outline: ContourOutline,
  paperDimensions: PaperDimensions
) => {
  const points = pointsOf(outline);
  const contours = modifyContourList(points).centerOnOrigin();
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
