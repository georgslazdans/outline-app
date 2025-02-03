"use client";

import { ReactNode, useEffect, useState } from "react";

import { useDetails } from "@/context/DetailsContext";
import StepResult from "@/lib/opencv/StepResult";
import { Dictionary } from "@/app/dictionaries";
import { AdvancedSettingsEditor } from "./AdvancedSettingsEditor";
import { ImageSelector } from "./ImageSelector";
import StepSetting from "@/lib/opencv/processor/steps/StepSettings";
import { useResultContext } from "../ResultContext";
import StepImage from "./StepImage";

type Props = {
  dictionary: Dictionary;
  children: ReactNode;
};

export const AdvancedCalibration = ({ dictionary, children }: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();
  const { stepResults } = useResultContext();
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
    if (detailsContext) {
      const updatedSettings = {
        ...detailsContext.settings,
        [currentStep!.stepName]: stepSetting,
      };
      const newDetails = { ...detailsContext, settings: updatedSettings };
      setDetailsContext(newDetails);
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
        <div className="xl:w-1/2">
          <StepImage currentStep={currentStep}></StepImage>
          {children}
        </div>
        <AdvancedSettingsEditor
          dictionary={dictionary}
          onChange={handleSettingsChange}
          stepName={currentStep?.stepName}
          allSettings={detailsContext.settings}
        ></AdvancedSettingsEditor>
      </div>
    </>
  );
};
