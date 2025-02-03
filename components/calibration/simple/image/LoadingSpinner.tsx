import { TailSpin } from "react-loader-spinner";
import { useResultContext } from "../../ResultContext";
import { useSettingStepContext } from "../SettingStepContext";
import { useCallback } from "react";
import CalibrationSettingStep from "../settings/CalibrationSettingStep";
import StepName from "@/lib/opencv/processor/steps/StepName";

const LoadingSpinner = () => {
  const { outdatedSteps } = useResultContext();
  const { settingStep } = useSettingStepContext();

  const isLoaderVisible = useCallback(() => {
    if (settingStep == CalibrationSettingStep.FIND_PAPER) {
      return outdatedSteps.includes(StepName.FIND_PAPER_OUTLINE);
    } else {
      return outdatedSteps.includes(StepName.FIND_OBJECT_OUTLINES);
    }
  }, [outdatedSteps, settingStep]);

  return (
    <div className="absolute w-full">
      <div className="mt-2 mr-2">
        <TailSpin
          visible={isLoaderVisible()}
          height="56"
          width="56"
          ariaLabel="tail-spin-loading"
          radius="2"
          wrapperClass="image-loader"
          color=""
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
