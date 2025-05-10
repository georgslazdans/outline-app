
import JsZip from "jszip";
import Dxf from "./Dxf";
import ContourPoints, { ContourOutline, modifyContourList } from "@/lib/data/contour/ContourPoints";
import { downloadFile } from "@/lib/utils/Download";

export const downloadAsDxf = (
  contourOutlines: ContourOutline[],
  fileName: string
) => {
  if (contourOutlines.length == 1) {
    const blob = asDxfFile(contourOutlines[0]);
    downloadFile(blob, `${fileName}.dxf`);
  } else {
    const blobs = contourOutlines.map((it) => asDxfFile(it));
    asZipFile(blobs).then((zip) => downloadFile(zip, `${fileName}_dxf.zip`));
  }
};

const asDxfFile = (
  outline: ContourOutline
) => {
  const points = pointsOf(outline);
  const dxf = Dxf.from(centerAndFlip(points));
  return new Blob([dxf], {
    type: "image/x-dxf",
  });
};

const centerAndFlip = (points: ContourPoints[]) => {
  const contours = modifyContourList(points).centerOnOrigin();
  return modifyContourList(contours).flipYPoints();
}

const pointsOf = (outline: ContourOutline): ContourPoints[] => {
  const holes = outline.holes ? outline.holes : [];
  return [outline.outline, ...holes];
};

const asZipFile = (blobs: Blob[]): Promise<Blob> => {
  var zip = new JsZip();
  blobs.forEach((blob, index) => zip.file(`outline-${index}.dxf`, blob));
  return zip.generateAsync({ type: "blob" });
};
