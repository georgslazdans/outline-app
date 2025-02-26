"use client";

import { Dictionary } from "@/app/dictionaries";
import { useCallback, useEffect, useState } from "react";
import SimpleCalibration from "./simple/SimpleCalibration";
import { AdvancedCalibration } from "./advanced/AdvancedCalibration";
import { useOpenCvWorker } from "./worker/OpenCvWorker";
import { useLoading } from "@/context/LoadingContext";
import { Context, useDetails } from "@/context/DetailsContext";
import { applyDefaults, defaultSettings } from "@/lib/opencv/Settings";
import { useIndexedDB } from "react-indexed-db-hook";
import { useRouter } from "next/navigation";
import ErrorMessage from "../error/ErrorMessage";
import BottomButtons from "./BottomButtons";
import useNavigationHistory from "@/context/NavigationHistory";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useResultContext } from "./ResultContext";
import { imageDataToBlob } from "@/lib/utils/ImageData";
import { ContourOutline } from "@/lib/data/contour/ContourPoints";
import ContextDetailsName from "./ContextDetailsName";

type Props = {
  dictionary: Dictionary;
};

const CalibrationComponent = ({ dictionary }: Props) => {
  const { update } = useIndexedDB("details");
  const { add: addImageBlob, deleteRecord: deleteImageBlob } =
    useIndexedDB("files");
  const router = useRouter();
  const { getHistory, clearHistory } = useNavigationHistory();

  const { detailsContext } = useDetails();

  const { setLoading } = useLoading();

  const [simpleMode, setSimpleMode] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string>();

  const { stepResults } = useResultContext();

  const { rerunOpenCv, settingsChanged, updateAllWorkData } =
    useOpenCvWorker(setErrorMessage);

  useEffect(() => {
    // TODO better initialization
    if (detailsContext && stepResults.length == 0) {
      updateAllWorkData();
    }
  }, [detailsContext, stepResults]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const saveContext = useCallback(
    (contours?: ContourOutline[], paperImageId?: number) => {
      if (paperImageId && detailsContext.paperImage) {
        deleteImageBlob(detailsContext.paperImage).then(() => {
          console.warn("Old paper image deleted!", detailsContext.paperImage);
        });
      }
      const context: Context = {
        ...detailsContext,
        contours: contours ? contours : [],
        paperImage: paperImageId ? paperImageId : detailsContext.paperImage,
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
    },
    [
      clearHistory,
      deleteImageBlob,
      detailsContext,
      getHistory,
      router,
      setLoading,
      update,
    ]
  );

  const saveAndClose = useCallback(() => {
    setLoading(true);
    const contours = stepResults.pop()!.contours;
    const paperImage = stepResults.find(
      (it) => it.stepName == StepName.EXTRACT_PAPER
    )?.imageData;
    if (paperImage) {
      imageDataToBlob(paperImage).then((paperImageBlob) => {
        addImageBlob({ blob: paperImageBlob }).then((paperImageId) => {
          saveContext(contours, paperImageId);
        });
      });
    } else {
      saveContext(contours);
    }
  }, [addImageBlob, saveContext, setLoading, stepResults]);

  useEffect(() => {
    // Fix for settings and their config changes between versions
    if (detailsContext?.settings) {
      detailsContext.settings = applyDefaults(
        defaultSettings(),
        detailsContext.settings
      );
    }
  });

  const openDetailedSettings = useCallback(() => {
    setSimpleMode(false);
  }, []);

  const onClose = useCallback(() => {
    simpleMode ? saveAndClose() : setSimpleMode(true);
  }, [saveAndClose, simpleMode]);

  const largeScreenErrorMessage = (
    <div className="hidden xl:block ml-4 mt-2">
      {errorMessage && (
        <ErrorMessage className="" text={errorMessage}></ErrorMessage>
      )}
    </div>
  );

  return (
    <>
      <ContextDetailsName></ContextDetailsName>
      <div className="xl:hidden">
        {errorMessage && (
          <ErrorMessage className="mb-2" text={errorMessage}></ErrorMessage>
        )}
      </div>
      <div className="flex flex-col h-[calc(100vh-5.9rem)] xl:h-[calc(100vh-9.9rem)]">
        <div className="flex-grow overflow-auto mb-auto">
          {simpleMode && detailsContext && (
            <>
              <SimpleCalibration
                dictionary={dictionary}
                settings={applyDefaults(
                  defaultSettings(),
                  detailsContext.settings
                )}
                openDetailedSettings={openDetailedSettings}
              >
                {largeScreenErrorMessage}
              </SimpleCalibration>
            </>
          )}
          {!simpleMode && detailsContext && (
            <>
              <AdvancedCalibration dictionary={dictionary}>
                {largeScreenErrorMessage}
              </AdvancedCalibration>
            </>
          )}
        </div>
        <div className="w-full mt-4">
          <BottomButtons
            dictionary={dictionary}
            rerun={rerunOpenCv}
            onClose={onClose}
            settingsChanged={settingsChanged}
            simpleMode={simpleMode}
          ></BottomButtons>
        </div>
      </div>
    </>
  );
};

export default CalibrationComponent;
