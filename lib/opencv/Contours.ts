import * as cv from "@techstark/opencv-js";
import Point from "../Point";

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

export const smoothOf = (
  contour: cv.Mat,
  maxDeviationPrecent = 0.002
): cv.Mat => {
  let smooth = new cv.Mat();
  const accuracy = maxDeviationPrecent * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, smooth, accuracy, true);
  return smooth;
};

export const drawContourShape = (points: Point[], size: cv.Size) => {
  const image = cv.Mat.zeros(size.height, size.width, cv.CV_8UC4);
  const closed = true;
  const strokeWidth = 15;
  const markersVector = new cv.MatVector();
  const mv = new cv.Mat(points.length, 1, cv.CV_32SC2);
  points.forEach(({ x, y }, idx) => {
    mv.intPtr(idx, 0)[0] = x;
    mv.intPtr(idx, 0)[1] = y;
  });
  markersVector.push_back(mv);

  cv.polylines(
    image,
    markersVector,
    closed,
    new cv.Scalar(218, 65, 103),
    strokeWidth
  );

  markersVector.delete();
  mv.delete();

  return image;
};

export const drawLargestContour = (
  imageSize: cv.Size,
  contours: cv.MatVector,
  hierarchy: cv.Mat
) => {
  const largestContourIndex = largestContourOf(contours);

  let contourImg = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    if (largestContourIndex != i) continue;
    let color = new cv.Scalar(218, 65, 103); // Primary colour
    cv.drawContours(
      contourImg,
      contours,
      i,
      color,
      10,
      cv.LINE_8,
      hierarchy,
      100
    );
  }
  return contourImg;
};

// Debug drawing

export const drawAllContours = (
  imageSize: cv.Size,
  contours: cv.MatVector,
  hierarchy: cv.Mat
): cv.Mat => {
  // Create a color image to draw contours
  let contourImg = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    let color = new cv.Scalar(
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255)
    );
    cv.drawContours(
      contourImg,
      contours,
      i,
      color,
      1,
      cv.LINE_8,
      hierarchy,
      100
    );
  }
  return contourImg;
};
