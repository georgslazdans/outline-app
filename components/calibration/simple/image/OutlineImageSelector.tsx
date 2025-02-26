import SelectField from "@/components/fields/SelectField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { OutlineImageViewer } from "./OutlineImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { useState, useEffect, useCallback } from "react";
import { useResultContext } from "../../ResultContext";
import { Dictionary } from "@/app/dictionaries";
import { useSettingStepContext } from "../SettingStepContext";
import CalibrationSettingStep from "../settings/CalibrationSettingStep";
import { useDetails } from "@/context/DetailsContext";
import { DisplayImageInfo } from "./DisplayImageInfo";

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
  settingStep: CalibrationSettingStep,
  dictionary: Dictionary
): Option[] => {
  if (settingStep == CalibrationSettingStep.FIND_PAPER) {
    return [
      imageEntryFor(StepName.INPUT, dictionary),
      imageEntryFor(StepName.ADAPTIVE_THRESHOLD, dictionary),
      imageEntryFor(StepName.CANNY_PAPER, dictionary),
    ];
  } else if (settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER) {
    return [imageEntryFor(StepName.CLOSE_CORNERS_PAPER, dictionary)];
  } else if (settingStep == CalibrationSettingStep.FIND_OBJECT) {
    return [
      imageEntryFor(StepName.OBJECT_THRESHOLD, dictionary),
      imageEntryFor(StepName.BLUR_OBJECT, dictionary),
      imageEntryFor(StepName.CANNY_OBJECT, dictionary),
    ];
  } else if (settingStep == CalibrationSettingStep.CLOSE_CORNERS) {
    return [imageEntryFor(StepName.CLOSE_CORNERS, dictionary)];
  } else if (settingStep == CalibrationSettingStep.HOLE_AND_SMOOTHING) {
    return [imageEntryFor(StepName.EXTRACT_PAPER, dictionary)];
  } else if (settingStep == CalibrationSettingStep.FILTER_OBJECTS) {
    return [imageEntryFor(StepName.EXTRACT_PAPER, dictionary)];
  }
  throw Error("Image entries not found for step: " + settingStep);
};

type Props = {
  dictionary: Dictionary;
};

const hasSameImages = (
  previous: ImageData[],
  newImages: ImageData[]
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

export const OutlineImageSelector = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();
  const { stepResults, objectOutlineImages, paperOutlineImages } =
    useResultContext();
  const { settingStep } = useSettingStepContext();
  const [displayImageInfo, setDisplayImageInfo] = useState<DisplayImageInfo>({
    baseStepName: StepName.INPUT,
    baseImage: new ImageData(1, 1),
    outlineImages: [],
  });

  const [backgroundImageOptions, setBackgroundImageOptions] = useState<
    Option[]
  >([]);

  const currentPaperOutlineImages = useCallback(() => {
    if (paperOutlineImages.length > 0) {
      const paperIndex =
        detailsContext.settings[StepName.EXTRACT_PAPER]["paperIndex"];
      const index =
        paperIndex >= paperOutlineImages.length
          ? paperOutlineImages.length - 1
          : paperIndex;
      return [paperOutlineImages[index]];
    } else {
      return [];
    }
  }, [detailsContext.settings, paperOutlineImages]);

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

  const outlineImagesForCurrentStep = useCallback((): ImageData[] => {
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
      setDisplayImageInfo((previous) => {
        return {
          baseStepName: newStep.stepName,
          baseImage: newStep.imageData,
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
          baseImage: step.imageData,
        };
      });
    },
    [stepResults]
  );

  useEffect(() => {
    const step = stepResults.find(
      (it) => it.stepName == displayImageInfo.baseStepName
    );
    if (step && displayImageInfo.baseImage != step.imageData) {
      setDisplayImageInfo((previous) => {
        return { ...previous, baseImage: step.imageData };
      });
    }
  }, [displayImageInfo.baseImage, displayImageInfo.baseStepName, stepResults]);

  useEffect(() => {
    const options = imageOptionsFor(settingStep, dictionary);
    const stepResultNames = stepResults.map((it) => it.stepName);
    const filteredOptions = options.filter((it) =>
      stepResultNames.includes(it.value)
    );

    setBackgroundImageOptions(filteredOptions);
  }, [stepResults, settingStep, dictionary]);

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
      ></OutlineImageViewer>
    </>
  );
};
