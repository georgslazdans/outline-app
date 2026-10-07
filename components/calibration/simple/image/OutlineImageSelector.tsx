import SelectField from "@/components/fields/SelectField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { OutlineImageViewer } from "./OutlineImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useResultContext } from "../../ResultContext";
import { Dictionary } from "@/app/dictionaries";
import { useSettingStepContext } from "../SettingStepContext";
import CalibrationSettingStep from "../settings/CalibrationSettingStep";
import { useDetails } from "@/context/DetailsContext";
import { DisplayImageInfo } from "./DisplayImageInfo";
import Settings, { inSettings } from "@/lib/opencv/Settings";
import ContourPoints, {
  ContourOutline,
  contourPointsOf,
} from "@/lib/data/contour/ContourPoints";
import { pxPerMmFor } from "@/lib/measure/PaperScale";

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
    outlinePoints: [],
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

  // Contour points that back the displayed outline images, picked with the same
  // branch logic as outlineImagesForCurrentStep() so the two always correspond.
  // The result is cached on the identity of the source contour objects: the
  // details/step contexts hand out fresh wrapper objects on many renders, but
  // the contour objects themselves only change when their step is reprocessed,
  // and the viewer relies on the array identity to detect real geometry changes.
  const pointsCache = useRef<{
    sources: ContourOutline[];
    points: ContourPoints[];
  }>({ sources: [], points: [] });

  const outlinePointsForCurrentStep = useCallback((): ContourPoints[] => {
    let sources: ContourOutline[];
    if (
      settingStep == CalibrationSettingStep.FIND_PAPER ||
      settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER
    ) {
      const contours = contoursOfStep(stepResults, StepName.FIND_PAPER_OUTLINE);
      sources =
        contours.length == 0
          ? []
          : [contours[Math.min(currentPaperIndex(), contours.length - 1)]];
    } else {
      const contours = contoursOfStep(
        stepResults,
        StepName.FIND_OBJECT_OUTLINES
      );
      const objectIndexes =
        settingStep == CalibrationSettingStep.FILTER_OBJECTS
          ? detailsContext.settings[StepName.FILTER_OBJECTS]["objectIndexes"]
          : undefined;
      sources =
        objectIndexes && objectIndexes.length > 0
          ? contours.filter((_, index) => objectIndexes.includes(index))
          : contours;
    }

    const cached = pointsCache.current;
    if (
      cached.sources.length === sources.length &&
      cached.sources.every((source, i) => source === sources[i])
    ) {
      return cached.points;
    }
    const points = sources.flatMap(contourPointsOf);
    pointsCache.current = { sources, points };
    return points;
  }, [
    settingStep,
    stepResults,
    detailsContext.settings,
    currentPaperIndex,
  ]);

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
    const outlinePoints = outlinePointsForCurrentStep();
    const newStep = newStepForAvailableOptions();
    if (newStep) {
      setDisplayImageInfo(() => {
        return {
          baseStepName: newStep.stepName,
          baseImage: newStep.pngBuffer,
          outlineImages: outlineImages,
          outlinePoints: outlinePoints,
        };
      });
    } else {
      setDisplayImageInfo((previous) => {
        if (
          hasSameImages(previous.outlineImages, outlineImages) &&
          previous.outlinePoints === outlinePoints
        ) {
          return previous;
        } else {
          return {
            ...previous,
            outlineImages: outlineImages,
            outlinePoints: outlinePoints,
          };
        }
      });
    }
  }, [
    newStepForAvailableOptions,
    outlineImagesForCurrentStep,
    outlinePointsForCurrentStep,
  ]);

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

  const pxPerMm = useMemo(
    () => pxPerMmFor({ settingStep, stepResults, settings }),
    [settingStep, stepResults, settings]
  );

  // On the paper steps the displayed image is the (resized) photo, not the
  // extracted deskewed paper, so mm readouts would only be approximate: the
  // measure tool is not offered there. Same branch as PaperScale.isPaperStep.
  const isPaperStep =
    settingStep == CalibrationSettingStep.FIND_PAPER ||
    settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER;

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
        dictionary={dictionary}
        pxPerMm={pxPerMm}
        canMeasure={!isPaperStep}
      ></OutlineImageViewer>
    </>
  );
};

const contoursOfStep = (
  stepResults: StepResult[],
  stepName: StepName
) => {
  const step = stepResults.find((it) => it.stepName == stepName);
  return step?.contours ?? [];
};
