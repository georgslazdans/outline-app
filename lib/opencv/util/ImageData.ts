import * as cv from "@techstark/opencv-js";
import ColorSpace, { conversionCodeOf } from "./ColorSpace";
import handleOpenCvError from "../OpenCvError";

export const imageOf = (
  imageData: ImageData,
  colorSpace: ColorSpace
): cv.Mat => {
  try {
    const image = cv.matFromImageData(imageData);
    if (colorSpace == ColorSpace.RGBA) {
      return image;
    }
    let destination = new cv.Mat();
    image.convertTo(destination, cv.CV_8U);
    const convertionCode = conversionCodeOf(colorSpace);
    cv.cvtColor(destination, destination, convertionCode);

    image.delete();
    return destination;
  } catch (e) {
    const message = "Failed to convert image";
    console.error(message, colorSpace, e);
    throw new Error(message);
  }
};

const asImageData = (image: cv.Mat): ImageData => {
  return new ImageData(
    new Uint8ClampedArray(image.data),
    image.cols,
    image.rows,
    { colorSpace: "srgb" }
  );
};

const imageDataOf = (image: cv.Mat): ImageData => {
  try {
    if (image.channels() == 4) {
      return asImageData(image);
    } else {
      const convertedImage = convertToRGBA(image);
      const imageData = asImageData(convertedImage);
      convertedImage.delete();
      return imageData;
    }
  } catch (e) {
    const error = handleOpenCvError(e);
    throw new Error("Failed to convert image: " + error);
  }
};

export const convertToRGBA = (image: cv.Mat): cv.Mat => {
  let destination = new cv.Mat();
  image.convertTo(destination, cv.CV_8U);
  cv.cvtColor(destination, destination, colorConversionOf(image.channels()));
  return destination;
};

const colorConversionOf = (channels: number) => {
  switch (channels) {
    case 1:
      return cv.COLOR_GRAY2RGBA;
    case 3:
      return cv.COLOR_RGB2RGBA;
  }
};

export default imageDataOf;
