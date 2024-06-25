import * as cv from "@techstark/opencv-js";

enum ColorSpace {
  RGB = "rgb",
  RGBA = "rgba",
  GRAY_SCALE = "gray",
}

export const conversionCodeOf = (colorSpace: ColorSpace) => {
  switch (colorSpace) {
    case ColorSpace.GRAY_SCALE:
      return cv.COLOR_RGBA2GRAY;
    case ColorSpace.RGB:
      return cv.COLOR_RGBA2RGB;
  }
  throw new Error("Color space not supported: " + colorSpace);
};

export default ColorSpace;
