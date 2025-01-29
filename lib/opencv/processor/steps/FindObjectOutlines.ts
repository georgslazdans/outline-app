import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import ImageContours, {
  fullHierarchyContoursOf,
  smoothOf,
} from "../../util/contours/Contours";
import StepName from "./StepName";
import holeFinder, {
  contourPointsOf,
  HoleSettings,
} from "../../util/contours/Holes";
import { ContourOutline, pointsFrom } from "@/lib/data/contour/ContourPoints";
import { drawContourOutlines } from "../../util/contours/Drawing";

interface ContourResult {
  index: number;
  area: number;
}

type SmoothSettings = {
  smoothOutline: boolean;
  smoothAccuracy: number;
};

type AreaThresholdSettings = {
  lowerThreshold: number;
  upperThreshold: number;
};

type FindObjectOutlineSettings = {
  smoothSettings: SmoothSettings;
  holeSettings: HoleSettings;
  areaThresholdSettings: AreaThresholdSettings;
};

const OBJECT_NOT_FOUND_MESSAGE = "Object contours not found!";

const findObjectOutlinesFrom: Process<FindObjectOutlineSettings> = (
  image: cv.Mat,
  settings: FindObjectOutlineSettings,
  previous: PreviousData
): ProcessFunctionResult => {
  const objectContours = fullHierarchyContoursOf(image);

  const outlineContours = findTopLevelContours(
    objectContours,
    image.size(),
    settings.areaThresholdSettings
  );

  if (outlineContours.length == 0) {
    return { errorMessage: OBJECT_NOT_FOUND_MESSAGE };
  }

  const contourPoints = outlineContours
    .sort((a, b) => (a.area > b.area ? -1 : 1))
    .map((it) =>
      contourAndHolesOf(it.index, objectContours, previous, settings)
    );
  const resultImage = drawContourOutlines(contourPoints, image.size());

  objectContours.delete();

  return {
    image: resultImage,
    contours: contourPoints,
  };
};

const findTopLevelContours = (
  imageContours: ImageContours,
  imageSize: cv.Size,
  areaThresholdSettings: AreaThresholdSettings
): ContourResult[] => {
  const { width, height } = imageSize;
  const upperAreaThreshold =
    width * height * areaThresholdSettings.upperThreshold;
  const lowerAreaThreshold =
    width * height * areaThresholdSettings.lowerThreshold;

  const results = [];
  const { contours, hierarchy } = imageContours;
  for (let i = 0; i < contours.size(); ++i) {
    if (isTopLevelContour(i, hierarchy)) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      if (area > lowerAreaThreshold && area < upperAreaThreshold) {
        results.push({
          index: i,
          area: area,
        });
      }
    }
  }
  return results;
};

const isTopLevelContour = (i: number, hierarchy: cv.Mat): boolean => {
  const hierarchyValue = hierarchy.intPtr(0, i);
  if (hierarchyValue.length >= 4) {
    const hierarchyIndex = hierarchyValue[3]; // parent contour index
    return hierarchyIndex == -1;
  } else {
    console.warn("Unknown hierarchy value", hierarchyValue);
    return true; //
  }
};

const contourAndHolesOf = (
  outlineContourIndex: number,
  objectContours: ImageContours,
  previous: PreviousData,
  settings: FindObjectOutlineSettings
): ContourOutline => {
  const handleSmoothing = handleContourSmoothing(settings);

  const holeIndexes = holeFinder()
    .withImage(previous.intermediateImageOf(StepName.BLUR_OBJECT))
    .withSettings(settings.holeSettings)
    .findHolesInContour(objectContours, outlineContourIndex);

  const outlineContour = handleSmoothing(
    objectContours.contours.get(outlineContourIndex)
  );

  const outlinePoints = pointsFrom(outlineContour);
  const holePoints = contourPointsOf(
    objectContours,
    holeIndexes,
    handleSmoothing
  );

  outlineContour.delete();

  return {
    outline: outlinePoints,
    holes: holePoints,
  };
};

const copyOf = (image: cv.Mat) => {
  const result = new cv.Mat();
  image.copyTo(result);
  return result;
};

const handleContourSmoothing = (
  settings: FindObjectOutlineSettings
): ((contour: cv.Mat) => cv.Mat) => {
  return (contour: cv.Mat) =>
    settings.smoothSettings.smoothOutline
      ? smoothOf(contour, settings.smoothSettings.smoothAccuracy / 10000)
      : copyOf(contour);
};

// const darkBlue = new cv.Scalar(44, 125, 148);
// const lineThickness = 5;
// const drawOtherShapes = () => {
//     const otherContours = drawAllContoursChild(
//         image.size(),
//         objectContours,
//         outlineContourIndex,
//         darkBlue,
//         lineThickness,
//         holeIndexes
//       );
//       cv.add(result, otherContours, resultingImage);
//       otherContours.delete();
// }

const findObjectOutlinesStep: ProcessingStep<FindObjectOutlineSettings> = {
  name: StepName.FIND_OBJECT_OUTLINES,
  settings: {
    smoothSettings: {
      smoothOutline: true,
      smoothAccuracy: 2,
    },
    holeSettings: {
      meanThreshold: 10,
      holeAreaThreshold: 1.0,
    },
    areaThresholdSettings: {
      upperThreshold: 0.95,
      lowerThreshold: 0.01,
    },
  },
  config: {
    smoothSettings: {
      type: "group",
      config: {
        smoothOutline: {
          type: "checkbox",
        },
        smoothAccuracy: {
          type: "number",
          min: 0,
          max: 100,
          step: 0.1,
          display: (settings, currentStep) =>
            settings[currentStep]?.smoothSettings.smoothOutline,
          tooltip: "Maximum deviation from original line as percentage",
        },
      },
    },
    holeSettings: {
      type: "group",
      config: {
        meanThreshold: {
          type: "number",
          min: 0,
          max: 30,
        },
        holeAreaThreshold: {
          type: "number",
          min: 0,
          max: 20,
          step: 0.1,
        },
      },
    },
    areaThresholdSettings: {
      type: "group",
      config: {
        upperThreshold: {
          type: "number",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "As percentage of image size",
        },
        lowerThreshold: {
          type: "number",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "As percentage of image size",
        },
      },
    },
  },
  imageColorSpace: () => ColorSpace.RGB,
  process: findObjectOutlinesFrom,
};

export default findObjectOutlinesStep;
