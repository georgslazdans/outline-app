import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";
import { contoursOf, drawAllContours, drawLargestContour, largestContourOf } from "./Contours";
import { pointsFrom } from "./Point";

export type ProcessingFunction = (image: cv.Mat, settings: Settings) => cv.Mat;

export const blurOf: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  const blurWidth = settings.blurWidth;
  let blurred = new cv.Mat();
  cv.GaussianBlur(
    image,
    blurred,
    new cv.Size(blurWidth, blurWidth),
    0,
    0,
    cv.BORDER_DEFAULT
  );
  return blurred;
};

export const grayScaleOf: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);
  return gray;
};

export const threshold: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let threshold = new cv.Mat();
  cv.threshold(image, threshold, 100, 200, cv.THRESH_BINARY);
  return threshold;
};

export const bilateralFilter: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let converted = new cv.Mat();
  let filtered = new cv.Mat();
  cv.cvtColor(image, converted, cv.COLOR_RGBA2RGB, 0);

  try {
    // You can try more different parameters
    cv.bilateralFilter(converted, filtered, 9, 75, 75, cv.BORDER_DEFAULT);
  } catch (error) {
    console.error(error);
    console.error("Error, yo", error);
  }

  cv.cvtColor(filtered, converted, cv.COLOR_RGB2RGBA, 0);
  filtered.delete();
  return converted;
};

export const cannyOf: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let edged = new cv.Mat();
  cv.Canny(image, edged, settings.threshold1, settings.threshold2);
  return edged;
};

export const debugFindCountours: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  return drawAllContours(image.size(), contours, hierarchy);
};


export const debugFindLargestCountour: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  return drawLargestContour(image.size(), contours, hierarchy);
};

export const extractPaperFrom: ProcessingFunction = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  const canny = cannyOf(image, settings);
  const {contours, hierarchy} = contoursOf(canny);

  const contourIndex = largestContourOf(contours);
  if (!contourIndex) {
    console.log("Contours not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return result;
  }
  const result = wrapImage(contours.get(contourIndex), image);

  contours.delete();
  hierarchy.delete();
  canny.delete();
  return result;
};

// TODO this needs to have a landscape vs portrait mode
const wrapImage = (contour: cv.Mat, src: cv.Mat) => {
  let corners = new cv.Mat();
  const accuracy = 0.02 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, corners, accuracy, true);

  // Sort the corners in order: top-left, top-right, bottom-right, bottom-left
  //corners = corners.sort((a, b) => a.y - b.y);
  const points = pointsFrom(corners).sort((a, b) => a.y - b.y);
  let topLeft = points[0].x < points[1].x ? points[0] : points[1];
  let topRight = points[0].x > points[1].x ? points[0] : points[1];
  let bottomLeft = points[2].x < points[3].x ? points[2] : points[3];
  let bottomRight = points[2].x > points[3].x ? points[2] : points[3];

  const scale = 4;
  // Define the rectangle of the standard paper size
  // let paperWidth = 210; // A4 paper width in mm
  let paperWidth = 297 * scale; // A4 paper width in mm
  // let paperHeight = 297; // A4 paper height in mm
  let paperHeight = 210 * scale; // A4 paper height in mm
  let dstCorners = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    paperWidth,
    0,
    paperWidth,
    paperHeight,
    0,
    paperHeight,
  ]);

  // Get the perspective transformation matrix
  let srcCorners = cv.matFromArray(4, 1, cv.CV_32FC2, [
    topLeft.x,
    topLeft.y,
    topRight.x,
    topRight.y,
    bottomRight.x,
    bottomRight.y,
    bottomLeft.x,
    bottomLeft.y,
  ]);
  let transformMatrix = cv.getPerspectiveTransform(srcCorners, dstCorners);

  // Warp the image
  let warped = new cv.Mat();
  cv.warpPerspective(
    src,
    warped,
    transformMatrix,
    new cv.Size(paperWidth, paperHeight)
  );

  return warped;
};
