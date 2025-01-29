"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEffect, useState } from "react";
import SimpleCalibration from "./simple/SimpleCalibration";
import { AdvancedCalibration } from "./advanced/AdvancedCalibration";
import { useOpenCvWorker } from "./OpenCvWorker";
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
import ContourPoints, {
  ContourOutline,
} from "@/lib/data/contour/ContourPoints";
import ContextDetailsName from "./ContextDetailsName";

type Props = {
  dictionary: Dictionary;
};

const CalibrationComponent = ({ dictionary }: Props) => {
  const { update } = useIndexedDB("details");
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

  const saveContext = (contours?: ContourOutline[], paperImageBlob?: Blob) => {
    const context: Context = {
      ...detailsContext,
      contours: contours ? contours : [],
      paperImage: paperImageBlob ? paperImageBlob : undefined,
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

  const saveAndClose = () => {
    setLoading(true);
    const contours = stepResults.pop()!.contours;
    const paperImage = stepResults.find(
      (it) => it.stepName == StepName.EXTRACT_PAPER
    )?.imageData;
    if (paperImage) {
      imageDataToBlob(paperImage).then((paperImageBlob) => {
        saveContext(contours, paperImageBlob ? paperImageBlob : undefined);
      });
    } else {
      saveContext(contours);
    }
  };

  useEffect(() => {
    // Fix for settings and their config changes between versions
    if (detailsContext?.settings) {
      detailsContext.settings = applyDefaults(
        defaultSettings(),
        detailsContext.settings
      );
    }
  });

  return (
    <>
      <ContextDetailsName></ContextDetailsName>
      <div className="flex flex-col h-[calc(100vh-5.9rem)] xl:h-[calc(100vh-9.9rem)]">
        <div className="flex-grow overflow-auto mb-auto">
          {errorMessage && (
            <ErrorMessage className="mb-2" text={errorMessage}></ErrorMessage>
          )}
          {simpleMode && detailsContext && (
            <>
              <SimpleCalibration
                dictionary={dictionary}
                settings={detailsContext.settings}
                openAdvancedMode={() => setSimpleMode(false)}
              ></SimpleCalibration>
            </>
          )}
          {!simpleMode && detailsContext && (
            <>
              <AdvancedCalibration
                dictionary={dictionary}
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

export default CalibrationComponent;
