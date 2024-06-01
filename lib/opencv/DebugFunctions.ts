import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";
import {
  drawAllContours,
  drawLargestContour,
} from "./Contours";

export const debugFindCountours = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  return drawAllContours(image.size(), contours, hierarchy);
};

export const debugFindLargestCountour = (
  image: cv.Mat,
  settings: Settings
): cv.Mat => {
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  return drawLargestContour(image.size(), contours, hierarchy);
};

