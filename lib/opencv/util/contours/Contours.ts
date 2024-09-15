import * as cv from "@techstark/opencv-js";

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

export const largestContourOf = (
  contours: cv.MatVector,
  maxAreaSize?: number
): number | null => {
  let area = 0;
  let result = null;
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const calculatedArea = cv.contourArea(contour);
    if (calculatedArea > area) {
      if (!maxAreaSize || calculatedArea < maxAreaSize) {
        area = calculatedArea;
        result = i;
      }
    }
  }

  return result;
};

export const smoothOf = (
  contour: cv.Mat,
  maxDeviationPercent = 0.002
): cv.Mat => {
  let smooth = new cv.Mat();
  const accuracy = maxDeviationPercent * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, smooth, accuracy, true);
  return smooth;
};

export default ImageContours;
