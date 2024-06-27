"use client";

import { Dictionary } from "@/app/dictionaries";
import { useCallback, useEffect, useMemo, useState } from "react";
import SimpleCalibration from "./simple/SimpleCalibration";
import { AdvancedCalibration } from "./advanced/AdvancedCalibration";
import { OpenCvWorker } from "./OpenCvWorker";
import { useLoading } from "@/context/LoadingContext";
import StepResult from "@/lib/opencv/StepResult";
import { useDetails } from "@/context/DetailsContext";
import { OpenCvWork, allWorkOf, stepWorkOf } from "@/lib/opencv/OpenCvWork";
import Settings, { firstChangedStep, settingsOf } from "@/lib/opencv/Settings";
import deepEqual from "@/lib/utils/Objects";
import { PROCESSING_STEPS } from "@/lib/opencv/processor/ImageProcessor";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useIndexedDB } from "react-indexed-db-hook";
import { useRouter } from "next/navigation";
import ErrorMessage from "./ErrorMessage";
import BottomButtons from "./BottomButtons";

type Props = {
  dictionary: Dictionary;
};

const OpenCvCalibration = ({ dictionary }: Props) => {
  const { update } = useIndexedDB("details");
  const router = useRouter();

  const { detailsContext } = useDetails();

  const { setLoading } = useLoading();

  const [simpleMode, setSimpleMode] = useState(true);

  const [openCvWork, setOpenCvWork] = useState<OpenCvWork>();
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [outlineCheckImage, setOutlineCheckImage] = useState<ImageData>();
  const [previousSettings, setPreviousSettings] = useState<Settings>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const settingsChanged = useMemo(
    () => !deepEqual(previousSettings, settingsOf(detailsContext)),
    [previousSettings, detailsContext]
  );
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
      setErrorMessage(undefined);
    },
    [setLoading, updateStepResults]
  );

  const handleStepError = useCallback(
    (newResult: StepResult[], error: string) => {
      setLoading(false);
      updateStepResults(newResult);
      setErrorMessage(error);
    },
    [setLoading, updateStepResults]
  );

  const handleWorkerError = useCallback(
    (error: string) => {
      setLoading(false);
      setErrorMessage(error);
    },
    [setLoading]
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
    if (detailsContext) {
      setLoading(true);
      const workData = allWorkOf(detailsContext);
      setWorkData(workData);
    }
  }, [detailsContext, setLoading]);

  const rerunOpenCv = useCallback(() => {
    var currentSettings = settingsOf(detailsContext);
    if (!previousSettings) {
      updateAllWorkData();
    } else if (settingsChanged) {
      let stepName = firstChangedStep(previousSettings, currentSettings);
      if (stepName && stepName != PROCESSING_STEPS[0].name) {
        if (
          stepName == StepName.EXTRACT_OBJECT ||
          stepName == StepName.EXTRACT_PAPER
        ) {
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
    settingsChanged,
    updateAllWorkData,
    updateCurrentStepData,
  ]);

  useEffect(() => {
    if (!openCvWork && detailsContext) {
      updateAllWorkData();
    }
  }, [detailsContext, openCvWork, updateAllWorkData]);

  const saveAndClose = () => {
    setLoading(true);
    const points = stepResults.pop()?.points;
    const context = { ...detailsContext, resultPoints: points };
    update(context).then(() => {
      setLoading(false);
      router.push("/");
    });
  };

  return (
    <>
      <OpenCvWorker
        message={openCvWork}
        onWorkerMessage={handleOpenCvWork}
        onStepError={handleStepError}
        onError={handleWorkerError}
      ></OpenCvWorker>
      <div className="flex flex-col min-h-full flex-grow">
        <div className="flex-grow overflow-auto">
          {errorMessage && (
            <ErrorMessage className="mb-2" text={errorMessage}></ErrorMessage>
          )}
          {simpleMode && detailsContext && (
            <>
              <SimpleCalibration
                dictionary={dictionary}
                stepResults={stepResults}
                settings={detailsContext.settings}
                openAdvancedMode={() => setSimpleMode(false)}
                outlineCheckImage={outlineCheckImage}
              ></SimpleCalibration>
            </>
          )}
          {!simpleMode && detailsContext && (
            <>
              <AdvancedCalibration
                dictionary={dictionary}
                stepResults={stepResults}
              ></AdvancedCalibration>
            </>
          )}
        </div>
        <div className="w-full">
          <BottomButtons
            dictionary={dictionary}
            rerun={rerunOpenCv}
            onClose={() => (simpleMode ? saveAndClose() : setSimpleMode(true))}
            settingsChanged={settingsChanged}
          ></BottomButtons>
        </div>
      </div>
    </>
  );
};

export default OpenCvCalibration;
