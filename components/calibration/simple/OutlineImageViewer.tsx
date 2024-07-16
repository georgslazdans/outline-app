import { useCallback, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  className?: string;
  baseImage?: ImageData;
  outlineImage?: ImageData;
  drawOutline: boolean;
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
  drawOutline,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d", { willReadFrequently: true });
  };

  const drawImage = useCallback(() => {
    const ctx = getContext();
    if (ctx && baseImage && outlineImage) {
      if (drawOutline) {
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
        <TransformComponent wrapperClass="!mx-auto">
          <canvas
            className="max-w-full max-h-[30vh] xl:max-h-[45vh]"
            ref={canvasRef}
            width={baseImage?.width}
            height={baseImage?.height}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
