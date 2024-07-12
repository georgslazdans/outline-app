import * as cv from "@techstark/opencv-js";
import Point, { pointsFrom } from "../../../Point";
import { ContourPoints } from "../../StepResult";

class ImageContours {
  contours: cv.MatVector;
  hierarchy: cv.Mat;

  constructor(contours: cv.MatVector, hierarchy: cv.Mat) {
    this.contours = contours;
    this.hierarchy = hierarchy;
  }

  delete(): void {
    this.contours.delete();
    this.hierarchy.delete();
  }
}

export const contoursOf = (image: cv.Mat): ImageContours => {
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  return new ImageContours(contours, hierarchy);
};

export const fancyContoursOf = (image: cv.Mat): ImageContours => {
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_TREE,
    cv.CHAIN_APPROX_TC89_L1
  );

  return new ImageContours(contours, hierarchy);
};

export const largestContourOf = (contours: cv.MatVector): number | null => {
  let area = 0;
  let result = null;
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const caluclatedArea = cv.contourArea(contour);
    if (caluclatedArea > area) {
      area = caluclatedArea;
      result = i;
    }
  }
  return result;
};

export const contoursWithHolesFrom = (
  contours: ImageContours,
  parentIndex: number,
  image: cv.Mat,
  threshold = 10,
  handleContourSmoothing: (contour: cv.Mat) => cv.Mat,
  scaleFactor: number = 1
): ContourPoints[] => {
  const probablyBackgroundValue = cv.mean(image)[0]; // TODO draw the inverse from outline
  const imageSize = image.size();
  const result: ContourPoints[] = [];
  for (let i = 0; i < contours.contours.size(); ++i) {
    const hierarchyIndex = contours.hierarchy.intPtr(0, i)[3]; // parent contour index
    if (hierarchyIndex != parentIndex) {
      continue;
    }
    const mask = maskOf(i, contours.contours, imageSize);
    const mean = cv.mean(image, mask)[0];
    if (
      mean <= probablyBackgroundValue + threshold / 2 &&
      mean >= probablyBackgroundValue - threshold / 2
    ) {
      const contour = handleContourSmoothing(contours.contours.get(i));
      const scaledPoints = pointsFrom(contour, scaleFactor);

      result.push(scaledPoints);
    }
    mask.delete();
  }
  return result;
};

const maskOf = (
  index: number,
  contours: cv.MatVector,
  imageSize: cv.Size
): cv.Mat => {
  let mask = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC1);

  cv.drawContours(
    mask,
    contours,
    index,
    new cv.Scalar(255, 255, 255),
    cv.FILLED
  );
  return mask;
};

export const smoothOf = (
  contour: cv.Mat,
  maxDeviationPrecent = 0.002
): cv.Mat => {
  let smooth = new cv.Mat();
  const accuracy = maxDeviationPrecent * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, smooth, accuracy, true);
  return smooth;
};


export default ImageContours;
