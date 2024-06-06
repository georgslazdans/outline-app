import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import StepResult from "@/lib/opencv/StepResult";
import Button from "../Button";
import { downloadFile } from "@/lib/Download";

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
  });

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if(canvas && currentStep?.imageData) {
        canvas.toBlob((blob) => {
          downloadFile(blob!, "TestImage.png");
        });
    }
  }, [currentStep?.imageData]);

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
      <Button onClick={downloadImage}>
        <label>Download Image</label>
      </Button>
    </div>
  );
};
