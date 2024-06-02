import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSelector } from "./ImageSelector";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import StepResult from "@/lib/opencv/StepResult";
import { Dictionary } from "@/app/dictionaries";

type Props = {
  dictionary: Dictionary;
  stepResults: StepResult[];
};

export const OpenCvDebugger = ({ stepResults, dictionary }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageData, setCurrentImageData] = useState<ImageData>(
    new ImageData(1, 1)
  );

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d");
  };

  const drawImage = useCallback(() => {
    const ctx = getContext();
    if (ctx) {
      ctx.putImageData(currentImageData, 0, 0);
    }
  }, [currentImageData]);

  useEffect(() => {
    drawImage();
  }, [currentImageData, drawImage]);

  const handleDataChange = (result: StepResult) => {
    setCurrentImageData(result.imageData);
  };

  return (
    <div>
      <ImageSelector
      dictionary={dictionary}
        stepResults={stepResults}
        onDataChange={handleDataChange}
      ></ImageSelector>
      <div className="mt-4">
        <TransformWrapper>
          <TransformComponent>
            <canvas
              className="max-w-full max-h-[80vh]"
              ref={canvasRef}
              width={currentImageData.width}
              height={currentImageData.height}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};
