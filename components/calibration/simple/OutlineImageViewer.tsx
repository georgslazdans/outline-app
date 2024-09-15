import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DrawOutlineButton from "./DrawOutlineButton";

type Props = {
  className?: string;
  baseImage?: ImageData;
  outlineImage?: ImageData;
};

const blendImageData = (
  ctx: CanvasRenderingContext2D,
  existingImageData: ImageData,
  newImageData: ImageData
) => {
  let blendedImageData = ctx.createImageData(
    existingImageData.width,
    existingImageData.height
  );

  const copyPixel = (i: number, imageData: ImageData) => {
    blendedImageData.data[i] = imageData.data[i];
    blendedImageData.data[i + 1] = imageData.data[i + 1];
    blendedImageData.data[i + 2] = imageData.data[i + 2];
    blendedImageData.data[i + 3] = imageData.data[i + 3];
  };

  for (let i = 0; i < existingImageData.data.length; i += 4) {
    if (newImageData.data[i + 3] > 0) {
      copyPixel(i, newImageData);
    } else {
      copyPixel(i, existingImageData);
    }
  }

  return blendedImageData;
};
export const OutlineImageViewer = ({
  className,
  baseImage,
  outlineImage,
}: Props) => {
  const [drawOutline, setDrawOutline] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d", { willReadFrequently: true });
  };

  const drawImage = useCallback(() => {
    const ctx = getContext();
    if (ctx && baseImage) {
      if (drawOutline && outlineImage) {
        const blendedImage = blendImageData(ctx, baseImage, outlineImage);
        ctx.putImageData(blendedImage, 0, 0);
      } else {
        ctx.putImageData(baseImage, 0, 0);
      }
    }
  }, [baseImage, outlineImage, drawOutline]);

  useEffect(() => {
    drawImage();
  }, [drawImage, drawOutline]);

  return (
    <div className={className}>
      <TransformWrapper>
        <div className="z-10 relative">
          <DrawOutlineButton
            icon={drawOutline ? "eye-slash" : "eye"}
            onClick={() => setDrawOutline(!drawOutline)}
          ></DrawOutlineButton>
        </div>
        <TransformComponent wrapperClass="!mx-auto">
          <canvas
            className="max-w-full max-h-[30vh] xl:max-h-[43vh]"
            ref={canvasRef}
            width={baseImage?.width}
            height={baseImage?.height}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
