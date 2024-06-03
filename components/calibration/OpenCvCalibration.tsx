"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useDetails } from "@/context/DetailsContext";
import Settings, { defaultSettings } from "@/lib/opencv/Settings";
import { ImageViewer } from "./ImageViewer";
import StepResult from "@/lib/opencv/StepResult";
import { OpenCvResult, OpenCvWork } from "@/lib/opencv/Worker";
import { useLoading } from "@/context/LoadingContext";
import { Dictionary } from "@/app/dictionaries";
import { OpenCvWorker } from "./OpenCvWorker";
import Button from "../Button";
import { SettingsEditor } from "./SettingsEditor";
import { ImageSelector } from "./ImageSelector";
import { StepSetting } from "@/lib/opencv/steps/ProcessingFunction";

type Props = {
  dictionary: Dictionary;
};

const indexOfStep = (
  allSteps: StepResult[],
  currentStep: StepResult
): number => {
  let index = 0;
  for (const step of allSteps) {
    if (step.stepName == currentStep.stepName) {
      break;
    }
    index += 1;
  }
  if (index >= allSteps.length) {
    throw new Error("Index not found for step: " + currentStep.stepName);
  }
  return index;
};

const previousStep = (allSteps: StepResult[], currentStep: StepResult) => {
  const stepIndex = indexOfStep(allSteps, currentStep);
  if (stepIndex == 0) {
    return allSteps[stepIndex];
  } else {
    return allSteps[stepIndex - 1];
  }
};

export const OpenCvCalibration = ({ dictionary }: Props) => {
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [openCvWork, setOpenCvWork] = useState<OpenCvWork>();
  const [currentStep, setCurrentStep] = useState<StepResult>();
  const [settings, setSettings] = useState<Settings>(defaultSettings());

  const { detailsContext } = useDetails();
  const { setLoading } = useLoading();

  const updateStepResults = useCallback((newResult: StepResult[]) => {
    setStepResults((previousResult) => {
      const updatedResult = [...previousResult];
      newResult.forEach((newStep) => {
        const index = updatedResult.findIndex(
          (step) => step.stepName === newStep.stepName
        );
        if (index !== -1) {
          updatedResult[index] = newStep;
        } else {
          updatedResult.push(newStep);
        }
      });
      if (newResult.length == 1) {
        setCurrentStep(newResult[0]);
      }
      return updatedResult;
    });
  }, []);

  const handleOpenCvWork = useCallback(
    (newResult: StepResult[]) => {
      setLoading(false);
      updateStepResults(newResult);
    },
    [setLoading, updateStepResults]
  );

  const updateCurrentStepData = useCallback(() => {
    setLoading(true);
    const step = previousStep(stepResults, currentStep!);
    const workData: OpenCvWork = {
      type: "step",
      data: {
        stepName: currentStep!.stepName,
        imageData: step.imageData,
        imageColorSpace: step.imageColorSpace,
        settings: settings,
      },
    };
    setOpenCvWork(workData);
  }, [currentStep, setLoading, settings, stepResults]);

  const updateAllWorkData = useCallback(() => {
    setLoading(true);
    const imageData =
      detailsContext?.imageData ||
      (typeof window !== "undefined" ? new ImageData(1, 1) : null);

    const workData: OpenCvWork = {
      type: "all",
      data: {
        imageData: imageData,
        settings: settings,
      },
    };
    setOpenCvWork(workData);
  }, [detailsContext, settings, setLoading]);

  useEffect(() => {
    if (!openCvWork && detailsContext) {
      updateAllWorkData();
    }
  }, [detailsContext, openCvWork, updateAllWorkData]);

  useEffect(() => {
    if (!currentStep && stepResults && stepResults.length > 0) {
      setCurrentStep(stepResults[0]);
    }
  }, [currentStep, stepResults]);

  const handleDataChange = (result: StepResult) => {
    setCurrentStep(result);
  };

  const handleSettingsChange = (stepSetting: StepSetting) => {
    setSettings((settings) => {
      return {
        ...settings,
        [currentStep!.stepName]: stepSetting,
      };
    });
  };

  return (
    <>
      <OpenCvWorker
        message={openCvWork}
        onWorkerMessage={handleOpenCvWork}
        onError={() => setLoading(false)}
      ></OpenCvWorker>
      <ImageSelector
        dictionary={dictionary}
        stepResults={stepResults}
        onDataChange={handleDataChange}
      ></ImageSelector>
      <ImageViewer className="mt-2" currentStep={currentStep}></ImageViewer>
      <SettingsEditor
        dictionary={dictionary}
        settings={settings}
        onChange={handleSettingsChange}
        step={currentStep?.stepName}
      ></SettingsEditor>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => updateCurrentStepData()}>
          <label>Rerun</label>
        </Button>
        <Button onClick={() => updateAllWorkData()}>
          <label>Rerun All</label>
        </Button>
      </div>
    </>
  );
};
