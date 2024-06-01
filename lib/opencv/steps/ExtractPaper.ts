import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import { pointsFrom } from "../../Point";
import cannyFunction from "./Canny";
import { contoursOf, largestContourOf } from "../Contours";

const cannyOf = cannyFunction.process;
type CannySettings = typeof cannyFunction.settings

type ExtractPaperSettings = {
  cannySettings: CannySettings;
};

export const extractPaperFrom: Process<ExtractPaperSettings> = (
  image: cv.Mat,
  settings: ExtractPaperSettings
): cv.Mat => {
  const canny = cannyOf(image, settings.cannySettings);
  const { contours, hierarchy } = contoursOf(canny);

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
  let paperWidth = 297 * scale;
  let paperHeight = 210 * scale;
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

const extractPaperFunction: ProcessingStep<ExtractPaperSettings> = {
  name: "extractPaper",
  settings: {
    cannySettings: {
        firstThreshold: 100,
        secondThreshold: 200.
    },
  },
  outputColorSpace: ColorSpace.GRAY_SCALE,
  process: extractPaperFrom,
};

export default extractPaperFunction;
