"use client";

import { useEffect, useState } from "react";

import { useDetails } from "@/context/DetailsContext";
import Settings from "@/lib/opencv/Settings";
import { ImageViewer } from "./ImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { Dictionary } from "@/app/dictionaries";
import Button from "../Button";
import { AdvancedSettingsEditor } from "./AdvancedSettingsEditor";
import { ImageSelector } from "./ImageSelector";
import { StepSetting } from "@/lib/opencv/steps/ProcessingFunction";
import StepName from "@/lib/opencv/steps/StepName";

type Props = {
  dictionary: Dictionary;
  stepResults: StepResult[];
  rerunStep: (stepName: StepName) => void;
  onClose: () => void;
};

export const AdvancedCalibration = ({
  dictionary,
  stepResults,
  rerunStep,
  onClose,
}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const [currentStep, setCurrentStep] = useState<StepResult>();

  useEffect(() => {
    if (!currentStep && stepResults && stepResults.length > 0) {
      setCurrentStep(stepResults[0]);
    }
  }, [currentStep, stepResults]);

  const handleDataChange = (result: StepResult) => {
    setCurrentStep(result);
  };

  const handleSettingsChange = (stepSetting: StepSetting) => {
    const saveSettings = (settings: Settings) => {
      const newDetails = { ...detailsContext, settings: settings };
      setDetailsContext(newDetails);
    };

    if (detailsContext) {
      const updatedSettings = {
        ...detailsContext.settings,
        [currentStep!.stepName]: stepSetting,
      };
      saveSettings(updatedSettings);
    }
  };

  return (
    <>
      <ImageSelector
        dictionary={dictionary}
        stepResults={stepResults}
        onDataChange={handleDataChange}
      ></ImageSelector>
      <ImageViewer className="mt-2" currentStep={currentStep}></ImageViewer>
      <AdvancedSettingsEditor
        dictionary={dictionary}
        settings={detailsContext.settings}
        onChange={handleSettingsChange}
        step={currentStep?.stepName}
      ></AdvancedSettingsEditor>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => rerunStep(currentStep!.stepName)}>
          <label>{dictionary.calibration.rerun}</label>
        </Button>
        <Button onClick={() => onClose()}>
          <label>{dictionary.calibration.done}</label>
        </Button>
      </div>
    </>
  );
};
