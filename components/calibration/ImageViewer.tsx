import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import StepResult from "@/lib/opencv/StepResult";

type Props = {
  className?: string;
  currentStep?: StepResult;
};
export const ImageViewer = ({ currentStep, className }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d");
  };

  const drawImage = useCallback(() => {
    const ctx = getContext();
    if (ctx && currentStep?.imageData) {
      ctx.putImageData(currentStep.imageData, 0, 0);
    }
  }, [currentStep]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  return (
    <div className={className}>
      <TransformWrapper>
        <TransformComponent>
          <canvas
            className="max-w-full max-h-[80vh]"
            ref={canvasRef}
            width={currentStep?.imageData.width}
            height={currentStep?.imageData.height}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};