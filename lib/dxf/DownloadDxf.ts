import ContourPoints, {
  ContourOutline,
  modifyContourList,
} from "../data/contour/ContourPoints";
import { downloadFile } from "../utils/Download";
import { PaperDimensions } from "../opencv/PaperSettings";
import JsZip from "jszip";
import Dxf from "./Dxf";

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
