"use client";

import { Dictionary } from "@/app/dictionaries";
import { useCallback, useEffect, useState } from "react";
import SimpleCalibration from "./SimpleCalibration";
import { AdvancedCalibration } from "./advanced/AdvancedCalibration";
import { OpenCvWorker } from "./OpenCvWorker";
import { useLoading } from "@/context/LoadingContext";
import StepResult from "@/lib/opencv/StepResult";
import { useDetails } from "@/context/DetailsContext";
import { OpenCvWork, allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";
import Settings, { firstChangedStep, settingsOf } from "@/lib/opencv/Settings";
import deepEqual from "@/lib/utils/Objects";
import { processingSteps } from "@/lib/opencv/ImageProcessor";
import extractObjectStep from "@/lib/opencv/steps/ExtractObject";
import extractPaperStep from "@/lib/opencv/steps/ExtractPaper";
import StepName from "@/lib/opencv/steps/StepName";

type Props = {
  dictionary: Dictionary;
};

const OpenCvCalibration = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();

  const { setLoading } = useLoading();

  const [simpleMode, setSimpleMode] = useState(true);

  const [openCvWork, setOpenCvWork] = useState<OpenCvWork>();
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [outlineCheckImage, setOutlineCheckImage] = useState<ImageData>();
  const [previousSettings, setPreviousSettings] = useState<Settings>();

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
    (newResult: StepResult[], outlineCheckImage: ImageData) => {
      setLoading(false);
      updateStepResults(newResult);
      setOutlineCheckImage(outlineCheckImage);
    },
    [setLoading, updateStepResults]
  );

  const setWorkData = (workData: OpenCvWork) => {
    setPreviousSettings(workData.data.settings);
    setOpenCvWork(workData);
  };

  const updateCurrentStepData = useCallback(
    (stepName: string) => {
      setLoading(true);
      const workData = stepWorkOf(
        stepResults,
        stepName,
        detailsContext?.settings
      );
      setWorkData(workData);
    },
    [detailsContext?.settings, setLoading, stepResults]
  );

  const updateAllWorkData = useCallback(() => {
    setLoading(true);
    if (detailsContext) {
      const workData = allWorkOf(detailsContext);
      setWorkData(workData);
    }
  }, [detailsContext, setLoading]);

  const rerunOpenCv = useCallback(() => {
    var currentSettings = settingsOf(detailsContext);
    if (!previousSettings) {
      updateAllWorkData();
    } else if (!deepEqual(previousSettings, currentSettings)) {
      let stepName = firstChangedStep(previousSettings, currentSettings);
      if (stepName && stepName != processingSteps[0].name) {
        if (stepName == StepName.EXTRACT_OBJECT || stepName == StepName.EXTRACT_PAPER) {
          stepName = StepName.THRESHOLD; // Basically need to rerun all 3 steps to get simplified image.
        }
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
          stepResults={stepResults}
          settings={detailsContext.settings}
          openAdvancedMode={() => setSimpleMode(false)}
          outlineCheckImage={outlineCheckImage}
          rerun={rerunOpenCv}
        ></SimpleCalibration>
      )}
      {!simpleMode && detailsContext && (
        <AdvancedCalibration
          dictionary={dictionary}
          stepResults={stepResults}
          rerun={rerunOpenCv}
          onClose={() => setSimpleMode(true)}
        ></AdvancedCalibration>
      )}
    </>
  );
};

export default OpenCvCalibration;

// const debounceTime = 1000;
// const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

// const handleOnChange = useCallback(
//   (event: ChangeEvent<HTMLInputElement>) => {
//     clearTimeout(timeoutId);
//     const timeout = setTimeout(() => {
//       onChange(event);
//     }, debounceTime);
//     setTimeoutId(timeout);
//   },
//   [onChange, timeoutId]
// );
