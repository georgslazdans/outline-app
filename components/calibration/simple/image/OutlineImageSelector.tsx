import SelectField from "@/components/fields/SelectField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { OutlineImageViewer } from "./OutlineImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { useState, useEffect } from "react";
import { useResultContext } from "../../ResultContext";
import { Dictionary } from "@/app/dictionaries";
import { useSettingStepContext } from "../SettingStepContext";
import CalibrationSettingStep from "../settings/CalibrationSettingStep";
import { useDetails } from "@/context/DetailsContext";

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
  } else if (settingStep == CalibrationSettingStep.FIND_OBJECT) {
    return [
      imageEntryFor(StepName.OBJECT_THRESHOLD, dictionary),
      imageEntryFor(StepName.BLUR_OBJECT, dictionary),
      imageEntryFor(StepName.CANNY_OBJECT, dictionary),
    ];
  } else if (settingStep == CalibrationSettingStep.CLOSE_CORNERS) {
    return [imageEntryFor(StepName.CLOSE_CORNERS, dictionary)];
  } else if (settingStep == CalibrationSettingStep.HOLE_SETTINGS) {
    return [
      imageEntryFor(StepName.EXTRACT_PAPER, dictionary),
    ];
  } else if (settingStep == CalibrationSettingStep.SMOOTHING) {
    return [
      imageEntryFor(StepName.EXTRACT_PAPER, dictionary),
    ];
  }
  throw Error("Image entries not found for step: " + settingStep);
};

type Props = {
  dictionary: Dictionary;
};

export const OutlineImageSelector = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();
  const { stepResults, outlineCheckImage, paperOutlineImages } =
    useResultContext();
  const { settingStep } = useSettingStepContext();

  const [backgroundImageStepName, setBackgroundImageStepName] = useState(
    StepName.INPUT
  );
  const [backgroundImageStep, setBackgroundImageStep] = useState<StepResult>();
  const [outlineImage, setOutlineImage] = useState<ImageData>();

  const [backgroundImageOptions, setBackgroundImageOptions] = useState<
    Option[]
  >([]);

  useEffect(() => {
    if (
      settingStep == CalibrationSettingStep.FIND_PAPER &&
      paperOutlineImages.length > 0
    ) {
      const paperIndex =
        detailsContext.settings[StepName.EXTRACT_PAPER]["paperIndex"];
      const index =
        paperIndex >= paperOutlineImages.length
          ? paperOutlineImages.length - 1
          : paperIndex;
      setOutlineImage(paperOutlineImages[index]);
    } else {
      setOutlineImage(outlineCheckImage);
    }
  }, [settingStep, detailsContext, paperOutlineImages, outlineCheckImage]);

  useEffect(() => {
    const step = stepResults.find(
      (it) => it.stepName == backgroundImageStepName
    )!;
    setBackgroundImageStep(step);
  }, [backgroundImageStepName, stepResults]);

  useEffect(() => {
    const options = imageOptionsFor(settingStep, dictionary);
    const stepResultNames = stepResults.map((it) => it.stepName);
    const filteredOptions = options.filter((it) =>
      stepResultNames.includes(it.value)
    );

    setBackgroundImageOptions(filteredOptions);
  }, [stepResults, settingStep, dictionary]);

  useEffect(() => {
    if (backgroundImageOptions.length > 0) {
      const hasElementSelected = !!backgroundImageOptions.find(
        (it) => it.value == backgroundImageStep?.stepName
      );
      if (!hasElementSelected) {
        const result = stepResults.find(
          (it) => it.stepName == backgroundImageOptions[0].value
        );
        setBackgroundImageStep(result);
      }
    }
  }, [backgroundImageOptions, backgroundImageStep, stepResults]);

  return (
    <>
      <div className="mb-2">
        <SelectField
          label={"Background Image"}
          name={"background-image"}
          value={backgroundImageStepName}
          options={backgroundImageOptions}
          onChange={(event) =>
            setBackgroundImageStepName(event.target.value as StepName)
          }
        ></SelectField>
      </div>
      <OutlineImageViewer
        className="max-h-[30vh] xl:max-h-[45vh]"
        baseImage={backgroundImageStep?.imageData}
        outlineImage={outlineImage}
      ></OutlineImageViewer>
    </>
  );
};
