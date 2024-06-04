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

export const smoothOf = (contour: cv.Mat): cv.Mat => {
  let smooth = new cv.Mat();
  const accuracy = 0.002 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, smooth, accuracy, true);
  return smooth;
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
      2,
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
