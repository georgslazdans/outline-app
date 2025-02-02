"use client";

import { ProcessAll } from "@/lib/opencv/processor/ProcessAll";
import WorkerResult from "@/lib/opencv/WorkerResult";
import { ProcessStep } from "@/lib/opencv/processor/ProcessStep";
import * as Comlink from "comlink";
import { useCallback, useMemo, useState } from "react";
import Settings, { firstChangedStep, settingsOf } from "@/lib/opencv/Settings";
import { allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";
import deepEqual from "@/lib/utils/Objects";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useDetails } from "@/context/DetailsContext";
import { useResultContext } from "../ResultContext";
import useAutoRerun from "./AutoRerun";
import { WorkerResultCallback } from "@/lib/opencv/WorkerContext";

export interface WorkerApi {
  processOutlineImage: (
    data: ProcessAll,
    callback: WorkerResultCallback
  ) => void;
  processOutlineStep: (
    data: ProcessStep,
    callback: WorkerResultCallback
  ) => void;
  [Comlink.releaseProxy]: () => void;
}

export const useOpenCvWorker = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const { detailsContext, contextImageData } = useDetails();
  const {
    stepResults,
    updateResult,
    setStepResults,
    updateObjectOutlines,
    updatePaperOutlines,
  } = useResultContext();
  const [previousSettings, setPreviousSettings] = useState<Settings>();
  const { api: openCvApi } = useMemo(() => newWorkerInstance(), []);

  const settingsChanged = useMemo(
    () => !deepEqual(previousSettings, settingsOf(detailsContext)),
    [previousSettings, detailsContext]
  );

  const handleWorkerResult = useCallback(
    (data: WorkerResult) => {
      if (data.status == "step") {
        setStepResults((previous) => {
          return previous.map((it) => {
            if (it.stepName == data.step.stepName) {
              return data.step;
            } else {
              return it;
            }
          });
        });
      } else if (data.status == "objectOutlines") {
        updateObjectOutlines(data.objectOutlineImages);
      } else if (data.status == "paperOutlines") {
        updatePaperOutlines(data.paperOutlineImages);
      } else if (data.status == "error") {
        setErrorMessage(data.error);
      }
    },
    [setStepResults, updateObjectOutlines, updatePaperOutlines, setErrorMessage]
  );

  const updateCurrentStepData = useCallback(
    (stepName: string) => {
      setErrorMessage(undefined);
      const workData = stepWorkOf(
        stepResults,
        stepName,
        detailsContext?.settings
      );
      setPreviousSettings(workData.settings);
      const resultHandler = Comlink.proxy(handleWorkerResult);
      openCvApi.processOutlineStep(workData, resultHandler);
    },
    [
      detailsContext?.settings,
      handleWorkerResult,
      openCvApi,
      setErrorMessage,
      stepResults,
    ]
  );

  const updateAllWorkData = useCallback(() => {
    setErrorMessage(undefined);
    if (detailsContext && contextImageData) {
      const workData = allWorkOf(detailsContext, contextImageData);
      setPreviousSettings(workData.settings);
      const resultHandler = Comlink.proxy(handleWorkerResult);
      openCvApi.processOutlineImage(workData, resultHandler);
    }
  }, [
    contextImageData,
    detailsContext,
    handleWorkerResult,
    openCvApi,
    setErrorMessage,
  ]);

  const rerunOpenCv = useCallback(() => {
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
    updateAllWorkData,
    updateCurrentStepData,
  ]);

  useAutoRerun(settingsChanged, rerunOpenCv);

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
