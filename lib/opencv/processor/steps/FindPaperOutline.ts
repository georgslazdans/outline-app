import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import { paperContoursOf } from "../../util/contours/Contours";
import StepName from "./StepName";
import { pointsFrom } from "@/lib/data/contour/ContourPoints";
import { drawAllContours } from "../../util/contours/Drawing";

type FindPaperOutlineSettings = {};

const PAPER_NOT_FOUND_MESSAGE =
  'Paper contours not found! Ensure that the paper outline is fully visible and uninterrupted in "Adaptive Threshold" step!';

const findPaperOutline: Process<FindPaperOutlineSettings> = (
  image: cv.Mat,
  settings: FindPaperOutlineSettings,
  previous: PreviousData
): ProcessFunctionResult => {
  const imageContours = paperContoursOf(image);

  const contours = imageContours.contours;

  const possibleOutlineIndexes = findPaperOutlineIndexes(
    contours,
    paperOutlineThreshold(image)
  );

  if (possibleOutlineIndexes.length == 0) {
    return { errorMessage: PAPER_NOT_FOUND_MESSAGE };
  }

  const outlinePoints = possibleOutlineIndexes.map((index) => {
    const contour = contours.get(index);
    const smoothedContour = smoothContour(contour);
    const points = pointsFrom(smoothedContour);
    smoothedContour.delete();
    return points;
  });

  const result = drawAllContours(
    image.size(),
    imageContours,
    possibleOutlineIndexes
  );

  imageContours.delete();

  return { image: result, contours: outlinePoints };
};

const paperOutlineThreshold = (image: cv.Mat) => {
  const paperAreaThreshold = 0.15;
  const { width, height } = image.size();
  return width * height * paperAreaThreshold;
};

const findPaperOutlineIndexes = (
  contours: cv.MatVector,
  paperAreaThreshold: number
): number[] => {
  const result = [];
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    if (contour.rows >= 4) {
      const calculatedArea = cv.contourArea(contour);
      if (calculatedArea > paperAreaThreshold) {
        const smoothedContour = smoothContour(contour);
        if (smoothedContour.rows == 4) {
          result.push(i);
        }
        if (smoothedContour.rows > 4) {
          console.warn("Contour with more than 4 points found!");
        }
        smoothedContour.delete();
      }
    }
  }
  return result;
};

const smoothContour = (contour: cv.Mat) => {
  let result = new cv.Mat();
  const accuracy = 0.02 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, result, accuracy, true);
  return result;
};

const findPaperOutlineStep: ProcessingStep<FindPaperOutlineSettings> = {
  name: StepName.FIND_PAPER_OUTLINE,
  settings: {},
  config: {},
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: findPaperOutline,
};

export default findPaperOutlineStep;
