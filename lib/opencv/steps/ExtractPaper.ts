import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import Point, { pointsFrom } from "../../Point";
import cannyStep from "./Canny";
import { contoursOf, largestContourOf } from "../Contours";
import StepName from "./StepName";

const cannyOf = cannyStep.process;
type CannySettings = typeof cannyStep.settings;

type ExtractPaperSettings = {
  cannySettings: CannySettings;
};

export const extractPaperFrom: Process<ExtractPaperSettings> = (
  image: cv.Mat,
  settings: ExtractPaperSettings
): ProcessResult => {
  const canny = cannyOf(image, settings.cannySettings).image;
  const { contours, hierarchy } = contoursOf(canny);

  const contourIndex = largestContourOf(contours);
  if (!contourIndex) {
    console.log("Contours not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
  }

  const smoothedContour = smoothContour(contours.get(contourIndex));
  const cornerPoints = pointsFrom(smoothedContour);
  const result = wrapImage(cornerPoints, image);

  contours.delete();
  hierarchy.delete();
  canny.delete();
  smoothedContour.delete();
  return { image: result, points: cornerPoints };
};

const smoothContour = (contour: cv.Mat) => {
  let result = new cv.Mat();
  const accuracy = 0.02 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, result, accuracy, true);
  return result;
};

const imageCoordinates = (paperCorners: Point[]) => {
  // Sort the corners in order: top-left, top-right, bottom-right, bottom-left
  //corners = corners.sort((a, b) => a.y - b.y);
  const points = paperCorners.sort((a, b) => a.y - b.y);
  let topLeft = points[0].x < points[1].x ? points[0] : points[1];
  let topRight = points[0].x > points[1].x ? points[0] : points[1];
  let bottomLeft = points[2].x < points[3].x ? points[2] : points[3];
  let bottomRight = points[2].x > points[3].x ? points[2] : points[3];

  return cv.matFromArray(4, 1, cv.CV_32FC2, [
    topLeft.x,
    topLeft.y,
    topRight.x,
    topRight.y,
    bottomRight.x,
    bottomRight.y,
    bottomLeft.x,
    bottomLeft.y,
  ]);
};

const wantedPaperCoordinates = (paperWidth: number, paperHeight: number) => {
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
  return dstCorners;
};

// TODO this needs to have a landscape vs portrait mode
const wrapImage = (cornerPoints: Point[], src: cv.Mat) => {
  const scale = 4;
  const paperWidth = 297 * scale;
  const paperHeight = 210 * scale;

  const srcCorners = imageCoordinates(cornerPoints);
  const dstCorners = wantedPaperCoordinates(paperWidth, paperHeight);

  const transformMatrix = cv.getPerspectiveTransform(srcCorners, dstCorners);

  // Warp the image
  let warped = new cv.Mat();
  cv.warpPerspective(
    src,
    warped,
    transformMatrix,
    new cv.Size(paperWidth, paperHeight)
  );

  srcCorners.delete();
  dstCorners.delete();
  transformMatrix.delete();

  return warped;
};

const extractPaperStep: ProcessingStep<ExtractPaperSettings> = {
  name: StepName.EXTRACT_PAPER,
  settings: {
    cannySettings: {
      firstThreshold: 100,
      secondThreshold: 200,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: extractPaperFrom,
};

export default extractPaperStep;
