"use client";

import { ProcessAll } from "@/lib/opencv/processor/ProcessAll";
import WorkerResult from "@/lib/opencv/WorkerResult";
import { ProcessStep } from "@/lib/opencv/processor/ProcessStep";
import * as Comlink from "comlink";
import { useCallback, useMemo, useState } from "react";
import StepResult from "@/lib/opencv/StepResult";
import Settings, { firstChangedStep, settingsOf } from "@/lib/opencv/Settings";
import { useLoading } from "@/context/LoadingContext";
import { allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";
import deepEqual from "@/lib/utils/Objects";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useDetails } from "@/context/DetailsContext";

export interface WorkerApi {
  processOutlineImage: (data: ProcessAll) => Promise<WorkerResult>;
  processOutlineStep: (data: ProcessStep) => Promise<WorkerResult>;
  [Comlink.releaseProxy]: () => void;
}

export const useOpenCvWorker = (
  stepResults: StepResult[],
  setStepResults: React.Dispatch<React.SetStateAction<StepResult[]>>,
  setCheckImages: (outline: ImageData, threshold?: ImageData) => void,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const { detailsContext } = useDetails();
  const { setLoading } = useLoading();
  const [previousSettings, setPreviousSettings] = useState<Settings>();
  const { api: openCvApi } = useMemo(() => newWorkerInstance(), []);

  const settingsChanged = useMemo(
    () => !deepEqual(previousSettings, settingsOf(detailsContext)),
    [previousSettings, detailsContext]
  );

  const updateStepResults = useCallback(
    (newResult: StepResult[]) => {
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
    },
    [setStepResults]
  );

  const handleWorkerResult = useCallback(
    (data: WorkerResult) => {
      setLoading(false);
      if (data.status === "success") {
        updateStepResults(data.result.data!);
        setCheckImages(data.outlineCheckImage, data.thresholdCheck);
        setErrorMessage(undefined);
      } else if (data.status === "failed") {
        updateStepResults(data.result.data!);
        setErrorMessage(data.result.error);
      } else {
        setErrorMessage(data.error);
      }
    },
    [setLoading, updateStepResults, setCheckImages, setErrorMessage]
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
      const workData = allWorkOf(detailsContext);
      setPreviousSettings(workData.settings);
      openCvApi.processOutlineImage(workData).then((data: WorkerResult) => {
        handleWorkerResult(data);
      });
    }
  }, [detailsContext, handleWorkerResult, openCvApi]);

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
