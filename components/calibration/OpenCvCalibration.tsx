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
      return updatedResult;
    });
  }, []);

  const handleOpenCvWork = useCallback((newResult: StepResult[]) => {
    console.log("Updating OpenCv Work Results", newResult);
    setLoading(false);
    updateStepResults(newResult);
  }, [setLoading, updateStepResults]);

  const updateWorkData = useCallback(() => {
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
  }, [detailsContext?.imageData, settings, setLoading]);

  useEffect(() => {
    if (!openCvWork) {
      updateWorkData();
    }
  }, [openCvWork, updateWorkData]);

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
        <Button onClick={() => updateWorkData()}>
          <label>Rerun</label>
        </Button>
        <Button onClick={() => updateWorkData()}>
          <label>Done</label>
        </Button>
      </div>
    </>
  );
};
