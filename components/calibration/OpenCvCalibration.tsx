"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEffect, useState } from "react";
import SimpleCalibration from "./simple/SimpleCalibration";
import { AdvancedCalibration } from "./advanced/AdvancedCalibration";
import { useOpenCvWorker } from "./OpenCvWorker";
import { useLoading } from "@/context/LoadingContext";
import StepResult from "@/lib/opencv/StepResult";
import { useDetails } from "@/context/DetailsContext";
import { applyDefaults, defaultSettings } from "@/lib/opencv/Settings";
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

  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [outlineCheckImage, setOutlineCheckImage] = useState<ImageData>();
  const [thresholdCheckImage, setThresholdCheckImage] = useState<ImageData>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const updateCheckImages = (outline: ImageData, threshold?: ImageData) => {
    setOutlineCheckImage(outline);
    setThresholdCheckImage(threshold);
  };

  const { rerunOpenCv, settingsChanged, updateAllWorkData } = useOpenCvWorker(
    stepResults,
    setStepResults,
    updateCheckImages,
    setErrorMessage
  );

  useEffect(() => {
    // TODO better initialization
    if (detailsContext && stepResults.length == 0) {
      updateAllWorkData();
    }
  }, [detailsContext, stepResults]);

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
    // Fix for previous data param changes
    if (detailsContext?.settings) {
      detailsContext.settings = applyDefaults(
        defaultSettings(),
        detailsContext.settings
      );
    }
  });

  return (
    <>
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
