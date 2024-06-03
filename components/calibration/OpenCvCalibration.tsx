"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useDetails } from "@/context/DetailsContext";
import Settings, { defaultSettings } from "@/lib/opencv/Settings";
import { OpenCvDebugger } from "./OpenCvDebugger";
import StepResult from "@/lib/opencv/StepResult";
import { OpenCvResult, OpenCvWork } from "@/lib/opencv/Worker";
import { useLoading } from "@/context/LoadingContext";
import { Dictionary } from "@/app/dictionaries";
import { OpenCvWorker } from "./OpenCvWorker";
import Button from "../Button";

type Props = {
  dictionary: Dictionary;
};

export const OpenCvCalibration = ({ dictionary }: Props) => {
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [openCvWork, setOpenCvWork] = useState<OpenCvWork>();

  const { detailsContext } = useDetails();
  const { setLoading } = useLoading();

  const updateStepResults = (newResult: StepResult[]) => {
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
  };

  const handleOpenCvWork = (newResult: StepResult[]) => {
    console.log("Updating OpenCv Work Results", newResult);
    setLoading(false)
    updateStepResults(newResult);
  }

  const updateWorkData = useCallback(() => {
    setLoading(true);
    const imageData =
      detailsContext?.imageData ||
      (typeof window !== "undefined" ? new ImageData(1, 1) : null);
    const settings: Settings = defaultSettings();

    const workData: OpenCvWork = {
      type: "all",
      data: {
        imageData: imageData,
        settings: settings,
      },
    };
    setOpenCvWork(workData);
  }, [detailsContext?.imageData, setLoading]);

  useEffect(() => {
    updateWorkData();
  }, [updateWorkData]);

  return (
    <>
      <OpenCvWorker
        message={openCvWork}
        onWorkerMessage={handleOpenCvWork}
      ></OpenCvWorker>
      <OpenCvDebugger
        dictionary={dictionary}
        stepResults={stepResults}
      ></OpenCvDebugger>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => updateWorkData()}><label>Rerun</label></Button>
        <Button onClick={() => updateWorkData()}><label>Done</label></Button>
      </div>
    </>
  );
};
