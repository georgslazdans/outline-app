"use client";

import { ProcessAll } from "@/lib/opencv/processor/ProcessAll";
import WorkerResult from "@/lib/opencv/WorkerResult";
import { ProcessStep } from "@/lib/opencv/processor/ProcessStep";
import * as Comlink from "comlink";
import { useCallback, useMemo, useState } from "react";
import StepResult, { findStep } from "@/lib/opencv/StepResult";
import Settings, { firstChangedStep, settingsOf } from "@/lib/opencv/Settings";
import { useLoading } from "@/context/LoadingContext";
import { allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";
import deepEqual from "@/lib/utils/Objects";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useDetails } from "@/context/DetailsContext";
import { useResultContext } from "./ResultContext";

export interface WorkerApi {
  processOutlineImage: (data: ProcessAll) => Promise<WorkerResult>;
  processOutlineStep: (data: ProcessStep) => Promise<WorkerResult>;
  [Comlink.releaseProxy]: () => void;
}

export const useOpenCvWorker = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const { detailsContext } = useDetails();
  const { stepResults, outlineCheckImage, paperOutlineImages, updateResult } =
    useResultContext();
  const { setLoading } = useLoading();
  const [previousSettings, setPreviousSettings] = useState<Settings>();
  const { api: openCvApi } = useMemo(() => newWorkerInstance(), []);

  const settingsChanged = useMemo(
    () => !deepEqual(previousSettings, settingsOf(detailsContext)),
    [previousSettings, detailsContext]
  );

  const updateStepResults = useCallback(
    (newResult: StepResult[]): StepResult[] => {
      const updatedResult = [...stepResults];
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
    },
    [stepResults]
  );

  const handleWorkerResult = useCallback(
    (data: WorkerResult) => {
      setLoading(false);
      if (data.status === "success") {
        const updatedStepResults = updateStepResults(data.result.data!);
        updateResult(
          updatedStepResults,
          data.paperOutlineImages,
          data.outlineCheckImage
        );
        setErrorMessage(undefined);
      } else if (data.status === "failed") {
        const updatedStepResults = updateStepResults(data.result.data!);
        const hasOutlineStep = !!findStep(StepName.FIND_PAPER_OUTLINE).in(data.result.data!)
        const hasObjectStep = !!findStep(StepName.EXTRACT_OBJECT).in(data.result.data!)
        updateResult(updatedStepResults, 
          hasOutlineStep ? paperOutlineImages : [],
          hasObjectStep ? outlineCheckImage : undefined);
        setErrorMessage(data.result.error);
      } else {
        setErrorMessage(data.error);
      }
    },
    [setLoading, updateStepResults, updateResult, setErrorMessage, paperOutlineImages, outlineCheckImage]
  );

  const updateCurrentStepData = useCallback(
    (stepName: string) => {
      const workData = stepWorkOf(
        stepResults,
        stepName,
        detailsContext?.settings
      );
      setPreviousSettings(workData.settings);
      openCvApi.processOutlineStep(workData).then((data: WorkerResult) => {
        handleWorkerResult(data);
      });
    },
    [detailsContext?.settings, handleWorkerResult, openCvApi, stepResults]
  );

  const updateAllWorkData = useCallback(() => {
    if (detailsContext) {
      setLoading(true);
      const workData = allWorkOf(detailsContext);
      setPreviousSettings(workData.settings);
      openCvApi.processOutlineImage(workData).then((data: WorkerResult) => {
        handleWorkerResult(data);
      });
    }
  }, [detailsContext, handleWorkerResult, openCvApi, setLoading]);

  const rerunOpenCv = useCallback(() => {
    setLoading(true);
    const currentSettings = settingsOf(detailsContext);
    if (!previousSettings) {
      updateAllWorkData();
    } else if (!deepEqual(previousSettings, currentSettings)) {
      let stepName = firstChangedStep(previousSettings, currentSettings);
      if (
        stepName &&
        ![StepName.INPUT, StepName.BILATERAL_FILTER].includes(stepName)
      ) {
        updateCurrentStepData(stepName);
      } else {
        updateAllWorkData();
      }
    }
  }, [
    detailsContext,
    previousSettings,
    setLoading,
    updateAllWorkData,
    updateCurrentStepData,
  ]);

  return {
    rerunOpenCv,
    updateAllWorkData,
    settingsChanged,
  };
};

export const newWorkerInstance = (): { api: WorkerApi; worker: Worker } => {
  const workerInstance = new Worker(
    new URL("@/lib/opencv/Worker.ts", import.meta.url)
  );
  const api = Comlink.wrap<WorkerApi>(workerInstance);
  return { api, worker: workerInstance };
};
