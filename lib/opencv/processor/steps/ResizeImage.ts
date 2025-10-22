import * as cv from "@techstark/opencv-js";
import ColorSpace from "../../util/ColorSpace";
import ProcessingStep from "./ProcessingFunction";
import StepName from "./StepName";

type ResizeImageSettings = {
  maxImageResolution: {
    width: number;
    height: number;
  };
};

const resizeImageStep: ProcessingStep<any> = {
  name: StepName.RESIZE_IMAGE,
  settings: {
    maxImageResolution: {
      width: 3840,
      height: 2160,
    },
  },
  imageColorSpace: () => ColorSpace.RGBA,
  process: async (image: cv.Mat, settings: ResizeImageSettings) => {
    if (isPortrait(image) && isPortraitLargerThanMax(image, settings)) {
      const scale = portraitScaleOf(image, settings);
      return { image: resizeImage(image, scale) };
    } else if (isLargerThanMax(image, settings)) {
      const scale = scaleOf(image, settings);
      return { image: resizeImage(image, scale) };
    } else {
      const result = new cv.Mat();
      image.copyTo(result);
      return { image: result };
    }
  },
  config: {
    maxImageResolution: {
      type: "group",
      config: {
        width: {
          type: "number",
          min: 1,
          max: 99999,
          step: 1,
        },
        height: {
          type: "number",
          min: 1,
          max: 99999,
          step: 1,
        },
      },
    },
  },
};

const isPortrait = (image: cv.Mat) => {
  const originalW = image.cols;
  const originalH = image.rows;
  return originalH > originalW;
};

const isPortraitLargerThanMax = (
  image: cv.Mat,
  settings: ResizeImageSettings
) => {
  const { width: maxH, height: maxW } = settings.maxImageResolution;
  const w = image.cols;
  const h = image.rows;
  return w > maxW || h > maxH;
};

const isLargerThanMax = (image: cv.Mat, settings: ResizeImageSettings) => {
  const { width: maxW, height: maxH } = settings.maxImageResolution;
  const w = image.cols;
  const h = image.rows;
  return w > maxW || h > maxH;
};

const portraitScaleOf = (image: cv.Mat, settings: ResizeImageSettings) => {
  const { width: maxH, height: maxW } = settings.maxImageResolution;
  const w = image.cols;
  const h = image.rows;
  return Math.min(maxW / w, maxH / h);
};

const scaleOf = (image: cv.Mat, settings: ResizeImageSettings) => {
  const { width: maxW, height: maxH } = settings.maxImageResolution;
  const w = image.cols;
  const h = image.rows;
  return Math.min(maxW / w, maxH / h);
};

const resizeImage = (image: cv.Mat, scale: number): cv.Mat => {
  const w = image.cols;
  const h = image.rows;
  const newW = Math.round(w * scale);
  const newH = Math.round(h * scale);

  const resized = new cv.Mat();
  cv.resize(image, resized, new cv.Size(newW, newH), 0, 0, cv.INTER_AREA);
  return resized;
};

export default resizeImageStep;
