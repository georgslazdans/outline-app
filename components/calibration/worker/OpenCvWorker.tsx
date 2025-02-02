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
import Steps from "@/lib/opencv/processor/Steps";

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
    setStepResults,
    outdatedSteps,
    setOutdatedSteps,
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
        const stepName = data.step.stepName;
        setStepResults((previous) => {
          return previous.map((it) => {
            if (it.stepName == stepName) {
              return data.step;
            } else {
              return it;
            }
          });
        });
        setOutdatedSteps((previous) => {
          return previous.filter((it) => it != stepName);
        });
      } else if (data.status == "objectOutlines") {
        updateObjectOutlines(data.objectOutlineImages);
      } else if (data.status == "paperOutlines") {
        updatePaperOutlines(data.paperOutlineImages);
      } else if (data.status == "error") {
        setErrorMessage(data.error);
        const stepName = data.stepName;
        if (stepName) {
          if (
            stepName == StepName.FIND_PAPER_OUTLINE ||
            Steps.is(stepName).before(StepName.FIND_PAPER_OUTLINE)
          ) {
            updatePaperOutlines([]);
          }
          if (
            stepName == StepName.FIND_OBJECT_OUTLINES ||
            Steps.is(stepName).before(StepName.FIND_OBJECT_OUTLINES)
          ) {
            updateObjectOutlines([]);
          }
        }
        setOutdatedSteps([]);
      }
    },
    [
      setStepResults,
      setOutdatedSteps,
      updateObjectOutlines,
      updatePaperOutlines,
      setErrorMessage,
    ]
  );

  const updateCurrentStepData = useCallback(
    (stepName: StepName) => {
      setErrorMessage(undefined);
      const workData = stepWorkOf(
        stepResults,
        stepName,
        detailsContext?.settings
      );
      setPreviousSettings(workData.settings);
      const resultHandler = Comlink.proxy(handleWorkerResult);
      openCvApi.processOutlineStep(workData, resultHandler);
      setOutdatedSteps(Steps.allStepNamesAfter(stepName));
    },
    [
      detailsContext?.settings,
      handleWorkerResult,
      openCvApi,
      setErrorMessage,
      setOutdatedSteps,
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
      setOutdatedSteps(Steps.allProcessingStepNames());
    }
  }, [
    contextImageData,
    detailsContext,
    handleWorkerResult,
    openCvApi,
    setErrorMessage,
    setOutdatedSteps,
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
