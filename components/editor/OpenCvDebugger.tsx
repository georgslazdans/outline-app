import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSelector } from "./ImageSelector";
import OutlineResult, { IntermediateData } from "@/lib/opencv/OutlineResult";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  outline: OutlineResult;
};

export const OpenCvDebugger = ({ outline }: Props) => {
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

  const handleDataChange = (data: IntermediateData) => {
    setCurrentImageData(data.imageData);
  };
  console.log("SVG", outline.svg);
  return (
    <div>
      <ImageSelector
        imageData={outline.intermediateData}
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
      <div className="mt-4">
        <svg dangerouslySetInnerHTML={{ __html: outline.svg }}></svg>
      </div>
    </div>
  );
};
