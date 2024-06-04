"use client";

import { Dictionary } from "@/app/dictionaries";
import { useCallback, useEffect, useState } from "react";
import SimpleCalibration from "./SimpleCalibration";
import { AdvancedCalibration } from "./AdvancedCalibration";
import { OpenCvWorker } from "./OpenCvWorker";
import { useLoading } from "@/context/LoadingContext";
import StepResult from "@/lib/opencv/StepResult";
import { useDetails } from "@/context/DetailsContext";
import { OpenCvWork, allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";

type Props = {
  dictionary: Dictionary;
};

const OpenCvCalibration = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();

  const { setLoading } = useLoading();

  const [simpleMode, setSimpleMode] = useState(false);

  const [openCvWork, setOpenCvWork] = useState<OpenCvWork>();
  const [stepResults, setStepResults] = useState<StepResult[]>([]);

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

  const handleOpenCvWork = useCallback(
    (newResult: StepResult[]) => {
      setLoading(false);
      updateStepResults(newResult);
    },
    [setLoading, updateStepResults]
  );

  const updateCurrentStepData = useCallback(
    (stepName: string) => {
      setLoading(true);
      const workData = stepWorkOf(
        stepResults,
        stepName,
        detailsContext?.settings
      );
      setOpenCvWork(workData);
    },
    [detailsContext?.settings, setLoading, stepResults]
  );

  const updateAllWorkData = useCallback(() => {
    setLoading(true);
    if (detailsContext) {
      const workData = allWorkOf(detailsContext);
      setOpenCvWork(workData);
    }
  }, [detailsContext, setLoading]);

  useEffect(() => {
    if (!openCvWork && detailsContext) {
      updateAllWorkData();
    }
  }, [detailsContext, openCvWork, updateAllWorkData]);

  return (
    <>
      <OpenCvWorker
        message={openCvWork}
        onWorkerMessage={handleOpenCvWork}
        /* TODO HANDLE ERRORS */
        onError={() => setLoading(false)}
      ></OpenCvWorker>

      {simpleMode && detailsContext && (
        <SimpleCalibration
          dictionary={dictionary}
          settings={detailsContext.settings}
          openAdvancedMode={() => setSimpleMode(false)}
        ></SimpleCalibration>
      )}
      {!simpleMode && detailsContext && (
        <AdvancedCalibration
          dictionary={dictionary}
          stepResults={stepResults}
          rerunStep={updateCurrentStepData}
          onClose={() => setSimpleMode(true)}
        ></AdvancedCalibration>
      )}
    </>
  );
};

export default OpenCvCalibration;
