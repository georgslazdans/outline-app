import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DrawOutlineButton from "./DrawOutlineButton";
import MeasureButton from "./MeasureButton";
import MeasureOverlay from "./MeasureOverlay";
import MeasureReadout from "./MeasureReadout";
import { useMeasureSession } from "./useMeasureSession";
import { DisplayImageInfo } from "./DisplayImageInfo";
import LoadingSpinner from "./LoadingSpinner";
import { Dictionary } from "@/app/dictionaries";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import UserPreference from "@/lib/preferences/UserPreference";
import { decodePngToImageData } from "@/lib/utils/ImagePng";

type Props = {
  className?: string;
  displayImageInfo: DisplayImageInfo;
  /** Contour points backing the displayed outline, the ruler picks on these. */
  outlinePoints: ContourPoints[];
  dictionary: Dictionary;
  /** Whether the measure tool is offered for the displayed image. */
  canMeasure?: boolean;
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

const decodeImages = async (displayImageInfo: DisplayImageInfo) => {
  return {
    baseImage: await decodePngToImageData(displayImageInfo.baseImage),
    outlineImages: await Promise.all(
      displayImageInfo.outlineImages.map(
        async (it) => await decodePngToImageData(it)
      )
    ),
  };
};

export const OutlineImageViewer = ({
  className,
  displayImageInfo,
  outlinePoints,
  dictionary,
  canMeasure = true,
}: Props) => {
  const [drawOutline, setDrawOutline] = useState(true);
  const [measureMode, setMeasureMode] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { value: outlineAlphaLevel } = useUserPreference(
    UserPreference.OUTLINE_ALPHA_LEVEL
  );
  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d", { willReadFrequently: true });
  };

  const getDrawImage = useCallback(
    async (baseImage: ImageData, outlineImages: ImageData[]) => {
      if (drawOutline && outlineImages && outlineImages.length != 0) {
        let blendedImage = baseImage;
        for (const outlineImage of outlineImages) {
          blendedImage = blendImageData(
            getContext()!!,
            blendedImage,
            outlineImage,
            outlineAlphaLevel as number
          );
        }
        return blendedImage;
      } else {
        return baseImage;
      }
    },
    [drawOutline, outlineAlphaLevel]
  );

  const drawImage = useCallback((image: ImageData) => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.putImageData(image, 0, 0);
      setCanvasSize({ width: image.width, height: image.height });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (displayImageInfo.baseImage.byteLength === 0) {
        console.log("No base image found");
        return;
      }
      const images = await decodeImages(displayImageInfo);
      if (!images.baseImage || cancelled) return;
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (canvas && ctx) {
        const image = await getDrawImage(
          images.baseImage,
          images.outlineImages
        );
        if (cancelled) return;
        drawImage(image);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [displayImageInfo, getDrawImage, drawImage]);

  useEffect(() => {
    if (!canMeasure) {
      setMeasureMode(false);
    }
  }, [canMeasure]);

  // Escape (from the overlay) or the toggle button leaves measure mode.
  const exitMeasureMode = useCallback(() => setMeasureMode(false), []);

  const { pointA, pointB, pick } = useMeasureSession(outlinePoints);
  const hasMeasurement = !!pointA && !!pointB;
  // The chip only carries the pick hints. Once both points are picked the value
  // is shown inline on the line, so the chip steps aside.
  const hint =
    pointA && !pointB
      ? dictionary.calibration.measure.pickSecond
      : dictionary.calibration.measure.pickFirst;

  const hasOutlinePoints = outlinePoints.some(
    (contour) => contour.points.length > 0
  );

  const toggleMeasureMode = () => {
    if (measureMode) {
      setMeasureMode(false);
    } else {
      setMeasureMode(true);
      setDrawOutline(true);
    }
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <TransformWrapper panning={{ velocityDisabled: true }}>
        <div className="z-10 relative">
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            <DrawOutlineButton
              icon={drawOutline ? "eye-slash" : "eye"}
              onClick={() => setDrawOutline(!drawOutline)}
            ></DrawOutlineButton>
            {hasOutlinePoints && canMeasure && (
              <MeasureButton
                active={measureMode}
                onClick={toggleMeasureMode}
                tooltip={dictionary.calibration.measure.tooltip}
              ></MeasureButton>
            )}
          </div>
          <LoadingSpinner></LoadingSpinner>
        </div>
        <TransformComponent wrapperClass="!mx-auto">
          <div className="relative inline-block">
            <canvas
              className="block max-w-full max-h-[30vh] xl:max-h-[40vh]"
              ref={canvasRef}
            />
            {measureMode && (
              <MeasureOverlay
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                contours={outlinePoints}
                pointA={pointA}
                pointB={pointB}
                onPick={pick}
                onExit={exitMeasureMode}
              ></MeasureOverlay>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
      {/* The hint chip lives outside the transformed content: it stays put and
          clickable while the image pans and zooms, and steps aside once a
          measurement exists (the value is shown inline on the line). */}
      {measureMode && !hasMeasurement && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-2">
          <MeasureReadout dictionary={dictionary} hint={hint}></MeasureReadout>
        </div>
      )}
    </div>
  );
};
