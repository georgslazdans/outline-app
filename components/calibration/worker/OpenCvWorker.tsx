"use client";

import { ProcessAll } from "@/lib/opencv/processor/ProcessAll";
import WorkerResult from "@/lib/opencv/WorkerResult";
import { ProcessStep } from "@/lib/opencv/processor/ProcessStep";
import * as Comlink from "comlink";
import { useCallback, useEffect, useMemo, useState } from "react";
import StepResult, {
  findStep,
  updateStepResultsWithNewData,
} from "@/lib/opencv/StepResult";
import Settings, { firstChangedStep, settingsOf } from "@/lib/opencv/Settings";
import { useLoading } from "@/context/LoadingContext";
import { allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";
import deepEqual from "@/lib/utils/Objects";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useDetails } from "@/context/DetailsContext";
import { useResultContext } from "../ResultContext";
import useAutoRerun from "./AutoRerun";

export interface WorkerApi {
  processOutlineImage: (data: ProcessAll) => Promise<WorkerResult>;
  processOutlineStep: (data: ProcessStep) => Promise<WorkerResult>;
  [Comlink.releaseProxy]: () => void;
}

export const useOpenCvWorker = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const { detailsContext, contextImageData } = useDetails();
  const { stepResults, objectOutlineImages, updateResult } = useResultContext();
  const { setLoading } = useLoading();
  const [previousSettings, setPreviousSettings] = useState<Settings>();
  const { api: openCvApi } = useMemo(() => newWorkerInstance(), []);

  const settingsChanged = useMemo(
    () => !deepEqual(previousSettings, settingsOf(detailsContext)),
    [previousSettings, detailsContext]
  );

  const handleWorkerResult = useCallback(
    (data: WorkerResult) => {
      setLoading(false);
      if (data.status === "success") {
        const updatedStepResults = updateStepResultsWithNewData(
          stepResults,
          data.result.data!
        );
        updateResult(
          updatedStepResults,
          data.paperOutlineImages,
          data.objectOutlineImages
        );
        setErrorMessage(undefined);
      } else if (data.status === "failed") {
        const updatedStepResults = updateStepResultsWithNewData(
          stepResults,
          data.result.data!
        );
        const hasObjectStep = !!findStep(StepName.FIND_OBJECT_OUTLINES).in(
          data.result.data!
        );
        updateResult(
          updatedStepResults,
          data.paperOutlineImages,
          hasObjectStep ? objectOutlineImages : []
        );
        setErrorMessage(data.result.error);
      } else {
        setErrorMessage(data.error);
      }
    },
    [
      setLoading,
      stepResults,
      updateResult,
      setErrorMessage,
      objectOutlineImages,
    ]
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
    if (detailsContext && contextImageData) {
      setLoading(true);
      const workData = allWorkOf(detailsContext, contextImageData);
      setPreviousSettings(workData.settings);
      openCvApi.processOutlineImage(workData).then((data: WorkerResult) => {
        handleWorkerResult(data);
      });
    }
  }, [
    contextImageData,
    detailsContext,
    handleWorkerResult,
    openCvApi,
    setLoading,
  ]);

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
