import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DrawOutlineButton from "./DrawOutlineButton";
import { DisplayImageInfo } from "./DisplayImageInfo";
import LoadingSpinner from "./LoadingSpinner";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import UserPreference from "@/lib/preferences/UserPreference";

type Props = {
  className?: string;
  displayImageInfo: DisplayImageInfo;
};

const blendImageData = (
  ctx: CanvasRenderingContext2D,
  existingImageData: ImageData,
  newImageData: ImageData,
  alphaLevel: number = 1.0
) => {
  let blendedImageData = ctx.createImageData(
    existingImageData.width,
    existingImageData.height
  );

  const blendPixel = (
    i: number,
    existingImageData: ImageData,
    newImageData: ImageData
  ) => {
    const alpha = (newImageData.data[i + 3] / 255) * alphaLevel; // Scale alpha with user-defined level
    const invAlpha = 1 - alpha;

    blendedImageData.data[i] =
      newImageData.data[i] * alpha + existingImageData.data[i] * invAlpha;
    blendedImageData.data[i + 1] =
      newImageData.data[i + 1] * alpha +
      existingImageData.data[i + 1] * invAlpha;
    blendedImageData.data[i + 2] =
      newImageData.data[i + 2] * alpha +
      existingImageData.data[i + 2] * invAlpha;
    blendedImageData.data[i + 3] =
      newImageData.data[i + 3] * alphaLevel +
      existingImageData.data[i + 3] * invAlpha;
  };

  const copyPixel = (i: number, imageData: ImageData) => {
    blendedImageData.data[i] = imageData.data[i];
    blendedImageData.data[i + 1] = imageData.data[i + 1];
    blendedImageData.data[i + 2] = imageData.data[i + 2];
    blendedImageData.data[i + 3] = imageData.data[i + 3];
  };

  for (let i = 0; i < existingImageData.data.length; i += 4) {
    if (newImageData.data[i + 3] > 0) {
      if (alphaLevel == 1) {
        copyPixel(i, newImageData);
      } else {
        blendPixel(i, existingImageData, newImageData);
      }
    } else {
      copyPixel(i, existingImageData);
    }
  }

  return blendedImageData;
};

export const OutlineImageViewer = ({ className, displayImageInfo }: Props) => {
  const [drawOutline, setDrawOutline] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { value: outlineAlphaLevel } = useUserPreference(
    UserPreference.OUTLINE_ALPHA_LEVEL
  );
  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d", { willReadFrequently: true });
  };

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    const { baseImage, outlineImages } = displayImageInfo;
    if (canvas && ctx && baseImage) {
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;
      if (drawOutline && outlineImages && outlineImages.length != 0) {
        let blendedImage = baseImage;
        for (const outlineImage of outlineImages) {
          blendedImage = blendImageData(
            ctx,
            blendedImage,
            outlineImage,
            outlineAlphaLevel as number
          );
        }
        ctx.putImageData(blendedImage, 0, 0);
      } else {
        ctx.putImageData(baseImage, 0, 0);
      }
    }
  }, [displayImageInfo, drawOutline, outlineAlphaLevel]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  return (
    <div className={className}>
      <TransformWrapper>
        <div className="z-10 relative">
          <DrawOutlineButton
            icon={drawOutline ? "eye-slash" : "eye"}
            onClick={() => setDrawOutline(!drawOutline)}
          ></DrawOutlineButton>
          <LoadingSpinner></LoadingSpinner>
        </div>
        <TransformComponent wrapperClass="!mx-auto">
          <canvas
            className="max-w-full max-h-[30vh] xl:max-h-[40vh]"
            ref={canvasRef}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
