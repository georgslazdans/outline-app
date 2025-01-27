import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import { paperContoursOf } from "../../util/contours/Contours";
import StepName from "./StepName";
import ContourPoints, { pointsFrom } from "@/lib/data/contour/ContourPoints";
import { drawAllContours } from "../../util/contours/Drawing";

interface ContourResult {
  index: number;
  area: number;
  points: ContourPoints;
}

type FindPaperOutlineSettings = {
  filterSimilarOutlines: boolean;
  similarityThreshold: number;
};

const PAPER_NOT_FOUND_MESSAGE =
  'Paper contours not found! Ensure that the paper outline is fully visible and uninterrupted in "Adaptive Threshold" step!';

const findPaperOutline: Process<FindPaperOutlineSettings> = (
  image: cv.Mat,
  settings: FindPaperOutlineSettings,
  previous: PreviousData
): ProcessFunctionResult => {
  const imageContours = paperContoursOf(image);

  const contours = imageContours.contours;

  const possibleOutlines = findPaperOutlines(
    contours,
    paperOutlineThreshold(image)
  );

  if (possibleOutlines.length == 0) {
    return { errorMessage: PAPER_NOT_FOUND_MESSAGE };
  }

  const filteredOutlines = settings.filterSimilarOutlines
    ? filterOutlines(
        possibleOutlines,
        image.size(),
        settings.similarityThreshold
      )
    : possibleOutlines;

  const result = drawAllContours(
    image.size(),
    imageContours,
    filteredOutlines.map((it) => it.index)
  );

  imageContours.delete();

  const resultPoints = filteredOutlines
    .sort((a, b) => (a.area > b.area ? -1 : 1))
    .map((it) => it.points);
  return { image: result, contours: resultPoints };
};

const paperOutlineThreshold = (image: cv.Mat) => {
  const paperAreaThreshold = 0.15;
  const { width, height } = image.size();
  return width * height * paperAreaThreshold;
};

const findPaperOutlines = (
  contours: cv.MatVector,
  paperAreaThreshold: number
): ContourResult[] => {
  const result = [];
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    if (contour.rows >= 4) {
      const calculatedArea = cv.contourArea(contour);
      if (calculatedArea > paperAreaThreshold) {
        const smoothedContour = smoothContour(contour);
        if (smoothedContour.rows == 4) {
          result.push({
            index: i,
            area: calculatedArea,
            points: pointsFrom(smoothedContour),
          });
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

const filterOutlines = (
  outlines: ContourResult[],
  imageSize: cv.Size,
  similarityThreshold: number = 0.01
): ContourResult[] => {
  const { width, height } = imageSize;
  const distanceThreshold = Math.max(width, height) * similarityThreshold;
  const areaThreshold = width * height * similarityThreshold;
  
  const result: ContourResult[] = [];

  outlines.forEach((it) => {
    const similarOutlines = outlines
      .filter(
        (outline) =>
          Math.abs(outline.points.points[0].x - it.points.points[0].x) <
            distanceThreshold &&
          Math.abs(outline.points.points[0].y - it.points.points[0].y) <
            distanceThreshold
      )
      .filter((outline) => Math.abs(outline.area - it.area) < areaThreshold);
    if (similarOutlines.length != 0) {
      const smallestOutline = smallestAreaOf(similarOutlines);
      if (!result.includes(smallestOutline)) {
        result.push(smallestOutline);
      }
    } else {
      result.push(it);
    }
  });
  return result;
};

const smallestAreaOf = (contours: ContourResult[]): ContourResult => {
  let smallestContour = contours[0];
  contours.forEach((it) => {
    if (it.area < smallestContour.area) {
      smallestContour = it;
    }
  });
  return smallestContour;
};

const smoothContour = (contour: cv.Mat) => {
  let result = new cv.Mat();
  const accuracy = 0.02 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, result, accuracy, true);
  return result;
};

const findPaperOutlineStep: ProcessingStep<FindPaperOutlineSettings> = {
  name: StepName.FIND_PAPER_OUTLINE,
  settings: {
    filterSimilarOutlines: true,
    similarityThreshold: 0.01,
  },
  config: {
    filterSimilarOutlines: {
      type: "checkbox",
      tooltip: "Filters similar outlines returning the smallest one",
    },
    similarityThreshold: {
      type: "number",
      min: 0,
      max: 1,
      step: 0.01,
      tooltip: "Similarity threshold in percentage based on image pixel count",
    },
  },
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: findPaperOutline,
};

export default findPaperOutlineStep;
