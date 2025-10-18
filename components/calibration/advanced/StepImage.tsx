import StepResult from "@/lib/opencv/StepResult";
import { PngImageViewer } from "../ImageViewer";
import { TailSpin } from "react-loader-spinner";
import { useCallback } from "react";
import { useResultContext } from "../ResultContext";

type Props = { currentStep?: StepResult };

const StepImage = ({ currentStep }: Props) => {
  const { outdatedSteps } = useResultContext();

  const isLoaderVisible = useCallback(() => {
    if (currentStep) {
      return outdatedSteps.includes(currentStep.stepName);
    }
  }, [currentStep, outdatedSteps]);

  return (
    <>
      <div className="relative">
        <PngImageViewer
          className=""
          pngBuffer={currentStep?.pngBuffer}
        ></PngImageViewer>
        <div className="absolute top-0 w-full">
          <div className="ml-auto mt-2 mr-2">
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
      </div>
    </>
  );
};

export default StepImage;
