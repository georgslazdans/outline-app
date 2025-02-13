
import JsZip from "jszip";
import Dxf from "./Dxf";
import ContourPoints, { ContourOutline, modifyContourList } from "@/lib/data/contour/ContourPoints";
import { PaperDimensions } from "@/lib/opencv/PaperSettings";
import { downloadFile } from "@/lib/utils/Download";

export const downloadAsDxf = (
  contourOutlines: ContourOutline[],
  paperDimensions: PaperDimensions,
  fileName: string
) => {
  if (contourOutlines.length == 1) {
    const blob = asDxfFile(contourOutlines[0], paperDimensions);
    downloadFile(blob, `${fileName}.dxf`);
  } else {
    const blobs = contourOutlines.map((it) => asDxfFile(it, paperDimensions));
    asZipFile(blobs).then((zip) => downloadFile(zip, `${fileName}_dxf.zip`));
  }
};

const asDxfFile = (
  outline: ContourOutline,
  paperDimensions: PaperDimensions
) => {
  const points = pointsOf(outline);
  const contours = modifyContourList(points).centerPoints(paperDimensions);
  const dxf = Dxf.from(contours, paperDimensions);
  return new Blob([dxf], {
    type: "image/x-dxf",
  });
};

const pointsOf = (outline: ContourOutline): ContourPoints[] => {
  const holes = outline.holes ? outline.holes : [];
  return [outline.outline, ...holes];
};

const asZipFile = (blobs: Blob[]): Promise<Blob> => {
  var zip = new JsZip();
  blobs.forEach((blob, index) => zip.file(`outline-${index}.dxf`, blob));
  return zip.generateAsync({ type: "blob" });
};
