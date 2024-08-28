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
import Settings, {
  defaultSettings,
  firstChangedStep,
  settingsOf,
} from "@/lib/opencv/Settings";
import deepEqual from "@/lib/utils/Objects";
import { useIndexedDB } from "react-indexed-db-hook";
import { useRouter } from "next/navigation";
import ErrorMessage from "./ErrorMessage";
import BottomButtons from "./BottomButtons";
import useNavigationHistory from "@/context/NavigationHistory";
import StepName from "@/lib/opencv/processor/steps/StepName";

type Props = {
  dictionary: Dictionary;
};

const OpenCvCalibration = ({ dictionary }: Props) => {
  const { update } = useIndexedDB("details");
  const router = useRouter();
  const { getHistory, clearHistory } = useNavigationHistory();

  const { detailsContext } = useDetails();

  const { setLoading } = useLoading();

  const [simpleMode, setSimpleMode] = useState(true);

  const [openCvWork, setOpenCvWork] = useState<OpenCvWork>();
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [outlineCheckImage, setOutlineCheckImage] = useState<ImageData>();
  const [thresholdCheckImage, setThresholdCheckImage] = useState<ImageData>();
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
    (
      newResult: StepResult[],
      outlineCheckImage: ImageData,
      thresholdCheck?: ImageData
    ) => {
      setLoading(false);
      updateStepResults(newResult);
      setOutlineCheckImage(outlineCheckImage);
      setThresholdCheckImage(thresholdCheck);
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
    const currentSettings = settingsOf(detailsContext);
    if (!previousSettings) {
      updateAllWorkData();
    } else if (settingsChanged) {
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
    const contours = stepResults.pop()!.contours;
    const paperImage = stepResults.find(
      (it) => it.stepName == StepName.EXTRACT_PAPER
    )?.imageData;
    const context = {
      ...detailsContext,
      contours: contours,
      paperImage: paperImage,
    };
    update(context).then(() => {
      setLoading(false);
      const lastRoute = getHistory().pop();
      if (!lastRoute || lastRoute == "/details") {
        router.push("/");
      } else {
        router.push(lastRoute);
      }
      clearHistory();
    });
  };

  useEffect(() => {
    const applyDefaults = (
      defaultSettings: Settings,
      currentSettings: Settings
    ): Settings => {
      const mergedSettings = { ...defaultSettings };

      for (const key in currentSettings) {
        if (currentSettings.hasOwnProperty(key)) {
          mergedSettings[key] = {
            ...defaultSettings[key],
            ...currentSettings[key],
          };
        }
      }

      return mergedSettings;
    };
    if (detailsContext?.settings) {
      detailsContext.settings = applyDefaults(
        defaultSettings(),
        detailsContext.settings
      );
    }
  });

  return (
    <>
      <OpenCvWorker
        message={openCvWork}
        onWorkerMessage={handleOpenCvWork}
        onStepError={handleStepError}
        onError={handleWorkerError}
      ></OpenCvWorker>
      <div className="flex flex-col h-[calc(100vh-5.9rem)] xl:h-[calc(100vh-9.9rem)]">
        <div className="flex-grow overflow-auto mb-auto">
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
                thresholdCheckImage={thresholdCheckImage}
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
        <div className="w-full mt-4">
          <BottomButtons
            dictionary={dictionary}
            rerun={rerunOpenCv}
            onClose={() => (simpleMode ? saveAndClose() : setSimpleMode(true))}
            settingsChanged={settingsChanged}
            simpleMode={simpleMode}
          ></BottomButtons>
        </div>
      </div>
    </>
  );
};

export default OpenCvCalibration;
