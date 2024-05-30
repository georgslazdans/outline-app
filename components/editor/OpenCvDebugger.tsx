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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.putImageData(currentImageData, 0, 0);
    }
  }, [currentImageData]);

  useEffect(() => {
    drawImage();
  }, [currentImageData, drawImage]);

  const handleDataChange = (data: IntermediateData) => {
    setCurrentImageData(data.imageData);
  };

  const handleScroll = (event: {
    preventDefault: () => void;
    deltaY: number;
    detail: number;
  }) => {
    //event.preventDefault();
    console.log("Scrolling!");
    var delta = event.deltaY
      ? event.deltaY / 40
      : event.detail
      ? -event.detail
      : 0;
    if (delta) {
      zoom(delta);
    }
  };
  let scaleFactor = 1.1;
  const zoom = (clicks: number) => {
    const ctx = getContext();
    if (!ctx) {
      return;
    }
    //var pt = ctx.transformedPoint(lastX, lastY);
    //ctx.translate(pt.x, pt.y);
    var factor = Math.pow(scaleFactor, clicks);
    ctx.scale(factor, factor);
    //ctx.translate(-pt.x, -pt.y);
    drawImage();
  };

  return (
    <div>
      <ImageSelector
        imageData={outline.intermediateData}
        onDataChange={handleDataChange}
      ></ImageSelector>
      <div>
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
