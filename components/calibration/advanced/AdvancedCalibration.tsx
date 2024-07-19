"use client";

import { useEffect, useState } from "react";

import { useDetails } from "@/context/DetailsContext";
import Settings from "@/lib/opencv/Settings";
import { ImageViewer } from "../ImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { Dictionary } from "@/app/dictionaries";
import { AdvancedSettingsEditor } from "./AdvancedSettingsEditor";
import { ImageSelector } from "./ImageSelector";
import StepSetting from "@/lib/opencv/processor/steps/StepSettings";

type Props = {
  dictionary: Dictionary;
  stepResults: StepResult[];
};

export const AdvancedCalibration = ({ dictionary, stepResults }: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const [currentStep, setCurrentStep] = useState<StepResult>();

  useEffect(() => {
    if (!currentStep && stepResults && stepResults.length > 0) {
      setCurrentStep(stepResults[0]);
    }
  }, [currentStep, stepResults]);

  useEffect(() => {
    if (currentStep) {
      const name = currentStep.stepName;
      const step = stepResults.find((it) => it.stepName === name);
      if (step != currentStep) {
        setCurrentStep(step);
      }
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

  const currentStepSettings = () => {
    const stepName = currentStep?.stepName;
    if (stepName) {
      return detailsContext.settings[stepName];
    }
  };

  return (
    <>
      <ImageSelector
        dictionary={dictionary}
        stepResults={stepResults}
        onDataChange={handleDataChange}
      ></ImageSelector>
      <div className="mt-2 flex flex-col gap-2 xl:flex-row flex-grow">
        <ImageViewer
          className="xl:w-1/2"
          imageData={currentStep?.imageData}
        ></ImageViewer>
        <AdvancedSettingsEditor
          dictionary={dictionary}
          currentSetting={currentStepSettings()}
          onChange={handleSettingsChange}
          step={currentStep?.stepName}
          settings={detailsContext.settings}
        ></AdvancedSettingsEditor>
      </div>
    </>
  );
};
