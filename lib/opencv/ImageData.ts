import * as cv from "@techstark/opencv-js";

const imageDataOf = (image: cv.Mat): ImageData => {
  var convertedImage = convertImage(image);
  return new ImageData(
    new Uint8ClampedArray(convertedImage.data),
    convertedImage.cols,
    convertedImage.rows
  );
};

const convertImage = (image: cv.Mat): cv.Mat => {
  const channels = image.channels();
  if (channels == 4) {
    return image;
  }
  let destination = new cv.Mat();
  image.convertTo(destination, cv.CV_8U);
  cv.cvtColor(destination, destination, colorConversionOf(channels));
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
