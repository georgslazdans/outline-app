import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import { scaleFactorOf } from "../ImageWarper";
import { paperDimensionsOf } from "../../PaperSettings";
import {
  ContourOutline,
  modifyContour,
  modifyContourList,
} from "@/lib/data/contour/ContourPoints";
import { drawContourOutlines } from "../../util/contours/Drawing";
import PreviousData from "../PreviousData";

type FilterObjectSettings = {
  objectIndexes: number[];
};

const filterObjects: Process<FilterObjectSettings> = (
  image: cv.Mat,
  settings: FilterObjectSettings,
  previous: PreviousData
): ProcessFunctionResult => {
  const outlines = previous.contoursOf(StepName.FIND_OBJECT_OUTLINES);
  if (!outlines || outlines.length == 0) {
    const result = new cv.Mat();
    image.copyTo(result);
    return {
      image: result,
      contours: [],
    };
  }

  const objectIndexes = settings.objectIndexes;
  const filteredContours = [];
  for (let i = 0; i < outlines.length; i++) {
    if (objectIndexes.length == 0 || objectIndexes.includes(i)) {
      filteredContours.push(outlines[i]);
    }
  }

  const resultImage = drawContourOutlines(filteredContours, image.size());
  const scaledContours = filteredContours.map((it) =>
    scaledResultOf(it, previous)
  );
  return {
    image: resultImage,
    contours: scaledContours,
  };
};

const scaledResultOf = (
  contour: ContourOutline,
  previous: PreviousData
): ContourOutline => {
  const scaleFactor = scaleFactorFrom(previous);

  const holes = contour.holes ? contour.holes : [];
  const scaledHoles = modifyContourList(holes).scalePoints(1 / scaleFactor);
  const scaledOutline = modifyContour(contour.outline).scalePoints(
    1 / scaleFactor
  );
  return {
    outline: scaledOutline,
    holes: scaledHoles,
  };
};

const scaleFactorFrom = (previous: PreviousData) => {
  const paperDimensions = paperDimensionsOf(
    previous.settingsOf(StepName.EXTRACT_PAPER).paperSettings
  );
  const imageSize = previous.intermediateImageOf(StepName.INPUT).size();
  return scaleFactorOf(imageSize, paperDimensions);
};

const filterObjectsStep: ProcessingStep<FilterObjectSettings> = {
  name: StepName.FILTER_OBJECTS,
  settings: {
    objectIndexes: [],
  },
  config: {
    objectIndexes: {
      type:"objectOutlineFilter"
    }
  },
  imageColorSpace: () => ColorSpace.RGB,
  process: filterObjects,
};

export default filterObjectsStep;
