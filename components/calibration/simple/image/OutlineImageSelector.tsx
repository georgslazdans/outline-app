import SelectField from "@/components/fields/SelectField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { OutlineImageViewer } from "./OutlineImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useResultContext } from "../../ResultContext";
import { Dictionary } from "@/app/dictionaries";
import { useSettingStepContext } from "../SettingStepContext";
import CalibrationSettingStep from "../settings/CalibrationSettingStep";
import { useDetails } from "@/context/DetailsContext";
import { DisplayImageInfo } from "./DisplayImageInfo";
import Settings, { inSettings } from "@/lib/opencv/Settings";
import {
  ContourOutline,
  contourPointsOf,
} from "@/lib/data/contour/ContourPoints";

interface Option {
  label: string;
  value: StepName;
}

const imageEntryFor = (stepName: StepName, dictionary: Dictionary): Option => {
  return {
    label: dictionary.calibration.step[stepName],
    value: stepName,
  };
};

const imageOptionsFor = (
  settings: Settings,
  settingStep: CalibrationSettingStep,
  dictionary: Dictionary
): Option[] => {
  if (settingStep == CalibrationSettingStep.FIND_PAPER) {
    return [
      imageEntryFor(StepName.RESIZE_IMAGE, dictionary),
      imageEntryFor(StepName.ADAPTIVE_THRESHOLD, dictionary),
      imageEntryFor(StepName.CANNY_PAPER, dictionary),
    ];
  } else if (settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER) {
    return [imageEntryFor(StepName.CLOSE_CORNERS_PAPER, dictionary)];
  } else if (settingStep == CalibrationSettingStep.FIND_OBJECT) {
    if (inSettings(settings).isPaperDetectionSkipped()) {
      return [
        imageEntryFor(StepName.RESIZE_IMAGE, dictionary),
        imageEntryFor(StepName.OBJECT_THRESHOLD, dictionary),
        imageEntryFor(StepName.BLUR_OBJECT, dictionary),
        imageEntryFor(StepName.CANNY_OBJECT, dictionary),
      ];
    } else {
      return [
        imageEntryFor(StepName.OBJECT_THRESHOLD, dictionary),
        imageEntryFor(StepName.BLUR_OBJECT, dictionary),
        imageEntryFor(StepName.CANNY_OBJECT, dictionary),
        imageEntryFor(StepName.EXTRACT_PAPER, dictionary),
      ];
    }
  } else if (settingStep == CalibrationSettingStep.CLOSE_CORNERS) {
    return [imageEntryFor(StepName.CLOSE_CORNERS, dictionary)];
  } else if (
    settingStep == CalibrationSettingStep.HOLE_AND_SMOOTHING ||
    settingStep == CalibrationSettingStep.FILTER_OBJECTS
  ) {
    if (inSettings(settings).isPaperDetectionSkipped()) {
      return [imageEntryFor(StepName.RESIZE_IMAGE, dictionary)];
    } else {
      return [imageEntryFor(StepName.EXTRACT_PAPER, dictionary)];
    }
  }
  throw Error("Image entries not found for step: " + settingStep);
};

type Props = {
  dictionary: Dictionary;
  settings: Settings;
};

const hasSameImages = (
  previous: ArrayBuffer[],
  newImages: ArrayBuffer[]
): boolean => {
  if (previous.length != newImages.length) {
    return false;
  }
  let areEqual = true;
  for (let i = 0; i < newImages.length; i++) {
    if (previous[i] != newImages[i]) {
      areEqual = false;
      break;
    }
  }
  return areEqual;
};

export const OutlineImageSelector = ({ settings, dictionary }: Props) => {
  const { detailsContext } = useDetails();
  const { stepResults, objectOutlineImages, paperOutlineImages } =
    useResultContext();
  const { settingStep } = useSettingStepContext();
  const [displayImageInfo, setDisplayImageInfo] = useState<DisplayImageInfo>({
    baseStepName: StepName.RESIZE_IMAGE,
    baseImage: new ArrayBuffer(0),
    outlineImages: [],
  });

  const [backgroundImageOptions, setBackgroundImageOptions] = useState<
    Option[]
  >([]);

  const currentPaperIndex = useCallback(() => {
    if (paperOutlineImages.length > 0) {
      const paperIndex =
        detailsContext.settings[StepName.EXTRACT_PAPER]["paperIndex"];
      return paperIndex >= paperOutlineImages.length
        ? paperOutlineImages.length - 1
        : paperIndex;
    } else {
      return 0;
    }
  }, [detailsContext.settings, paperOutlineImages]);

  const currentPaperOutlineImages = useCallback(() => {
    if (paperOutlineImages.length > 0) {
      return [paperOutlineImages[currentPaperIndex()]];
    } else {
      return [];
    }
  }, [paperOutlineImages, currentPaperIndex]);

  const currentObjectOutlineImages = useCallback(() => {
    const objectIndexes =
      detailsContext.settings[StepName.FILTER_OBJECTS]["objectIndexes"];
    if (objectIndexes && objectIndexes.length > 0) {
      const images = objectOutlineImages.filter((it, index) =>
        objectIndexes.includes(index)
      );
      return images;
    } else {
      return objectOutlineImages;
    }
  }, [detailsContext.settings, objectOutlineImages]);

  const outlineImagesForCurrentStep = useCallback((): ArrayBuffer[] => {
    if (
      settingStep == CalibrationSettingStep.FIND_PAPER ||
      settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER
    ) {
      return currentPaperOutlineImages();
    } else if (settingStep == CalibrationSettingStep.FILTER_OBJECTS) {
      return currentObjectOutlineImages();
    } else {
      return objectOutlineImages;
    }
  }, [
    settingStep,
    currentPaperOutlineImages,
    currentObjectOutlineImages,
    objectOutlineImages,
  ]);

  const isPaperStep =
    settingStep == CalibrationSettingStep.FIND_PAPER ||
    settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER;
  const paperContours = contoursOfStep(
    stepResults,
    StepName.FIND_PAPER_OUTLINE
  );
  const objectContours = contoursOfStep(
    stepResults,
    StepName.FIND_OBJECT_OUTLINES
  );
  const objectIndexes =
    settingStep == CalibrationSettingStep.FILTER_OBJECTS
      ? detailsContext.settings[StepName.FILTER_OBJECTS]["objectIndexes"]
      : undefined;
  const paperIndex = currentPaperIndex();

  const outlinePoints = useMemo(
    () =>
      sourcesFor(
        isPaperStep,
        paperContours,
        objectContours,
        paperIndex,
        objectIndexes
      ).flatMap(contourPointsOf),
    [isPaperStep, paperContours, paperIndex, objectContours, objectIndexes]
  );

  const newStepForAvailableOptions = useCallback((): StepResult | undefined => {
    if (backgroundImageOptions.length > 0) {
      const hasElementSelected = !!backgroundImageOptions.find(
        (it) => it.value == displayImageInfo?.baseStepName
      );
      if (!hasElementSelected) {
        const result = stepResults.find(
          (it) => it.stepName == backgroundImageOptions[0].value
        );
        return result;
      }
    }
  }, [backgroundImageOptions, displayImageInfo?.baseStepName, stepResults]);

  useEffect(() => {
    const outlineImages = outlineImagesForCurrentStep();
    const newStep = newStepForAvailableOptions();
    if (newStep) {
      setDisplayImageInfo(() => {
        return {
          baseStepName: newStep.stepName,
          baseImage: newStep.pngBuffer,
          outlineImages: outlineImages,
        };
      });
    } else {
      setDisplayImageInfo((previous) => {
        if (hasSameImages(previous.outlineImages, outlineImages)) {
          return previous;
        } else {
          return { ...previous, outlineImages: outlineImages };
        }
      });
    }
  }, [newStepForAvailableOptions, outlineImagesForCurrentStep]);

  const updateBackgroundStep = useCallback(
    (stepName: StepName) => {
      const step = stepResults.find((it) => it.stepName == stepName)!;
      setDisplayImageInfo((previous) => {
        return {
          ...previous,
          baseStepName: step.stepName,
          baseImage: step.pngBuffer,
        };
      });
    },
    [stepResults]
  );

  useEffect(() => {
    const step = stepResults.find(
      (it) => it.stepName == displayImageInfo.baseStepName
    );
    if (step && displayImageInfo.baseImage != step.pngBuffer) {
      setDisplayImageInfo((previous) => {
        return { ...previous, baseImage: step.pngBuffer };
      });
    }
  }, [displayImageInfo.baseImage, displayImageInfo.baseStepName, stepResults]);

  useEffect(() => {
    const options = imageOptionsFor(settings, settingStep, dictionary);
    const stepResultNames = stepResults.map((it) => it.stepName);
    const filteredOptions = options.filter((it) =>
      stepResultNames.includes(it.value)
    );

    setBackgroundImageOptions(filteredOptions);
  }, [stepResults, settingStep, dictionary, settings]);

  return (
    <>
      <div className="mb-2">
        <SelectField
          label={"Background Image"}
          name={"background-image"}
          value={displayImageInfo.baseStepName}
          options={backgroundImageOptions}
          onChange={(event) =>
            updateBackgroundStep(event.target.value as StepName)
          }
        ></SelectField>
      </div>
      <OutlineImageViewer
        className="max-h-[30vh] xl:max-h-[45vh]"
        displayImageInfo={displayImageInfo}
        outlinePoints={outlinePoints}
        dictionary={dictionary}
        canMeasure={!isPaperStep}
      ></OutlineImageViewer>
    </>
  );
};

// Empty contours get a shared constant so a placeholder step keeps a stable
// identity across renders and does not invalidate the points memo.
const NO_CONTOURS: ContourOutline[] = [];

const contoursOfStep = (
  stepResults: StepResult[],
  stepName: StepName
) => {
  const step = stepResults.find((it) => it.stepName == stepName);
  return step?.contours ?? NO_CONTOURS;
};

// Which contours back the displayed outline: the selected paper outline on
// paper steps, the filtered (or all) object outlines elsewhere.
const sourcesFor = (
  isPaperStep: boolean,
  paperContours: ContourOutline[],
  objectContours: ContourOutline[],
  paperIndex: number,
  objectIndexes: number[] | undefined
): ContourOutline[] => {
  if (!isPaperStep) {
    return objectIndexes && objectIndexes.length > 0
      ? objectContours.filter((_, index) => objectIndexes.includes(index))
      : objectContours;
  }
  return paperContours.length == 0
    ? []
    : [paperContours[Math.min(paperIndex, paperContours.length - 1)]];
};
