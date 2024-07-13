import * as cv from "@techstark/opencv-js";

import { pointsFrom } from "@/lib/Point";
import { ContourPoints } from "../../StepResult";
import ImageContours from "./Contours";

const holeFinder = () => {
  let _image: cv.Mat;
  let _backgroundColor: number;
  let _meanThreshold: number;
  let _areaHoleThreshold: number;
  let _scaleFactor: number;
  let contourProcessing: (contour: cv.Mat) => cv.Mat;

  const result = {
    withImage: (image: cv.Mat) => {
      _image = image;
      _backgroundColor = cv.mean(_image)[0]; // TODO use inverse of object mask!
      return result;
    },
    withSettings: (
      scaleFactor: number,
      meanThreshold: number,
      areaHoleThreshold: number
    ) => {
      _scaleFactor = scaleFactor;
      _meanThreshold = meanThreshold;
      _areaHoleThreshold = areaHoleThreshold;
      return result;
    },
    withContourProcesing: (processingFunction: (contour: cv.Mat) => cv.Mat) => {
      contourProcessing = processingFunction;
      return result;
    },
    findHolesInContour: (
      contours: ImageContours,
      parentIndex: number
    ): ContourPoints[] => {
      const contourPoints: ContourPoints[] = [];
      for (let i = 0; i < contours.contours.size(); ++i) {
        if (!isParent(i, parentIndex, contours.hierarchy)) {
          continue;
        }

        if (
          isContour(contours.contours, i)
            .ofBackgroundColour(_backgroundColor, _meanThreshold)
            .inImage(_image)
        ) {
          const contour = contourProcessing(contours.contours.get(i));
          if (isHoleLargerThanThreshold(contour, _areaHoleThreshold)) {
            const scaledPoints = pointsFrom(contour, _scaleFactor);
            contourPoints.push(scaledPoints);
          }
        }
      }
      return contourPoints;
    },
  };

  return result;
};

const isParent = (
  i: number,
  parentIndex: number,
  hierarchy: cv.Mat
): boolean => {
  const hierarchyIndex = hierarchy.intPtr(0, i)[3]; // parent contour index
  return hierarchyIndex == parentIndex;
};

const isHoleLargerThanThreshold = (
  contour: cv.Mat,
  areaHoleThreshold: number
): boolean => {
  const contourArea = cv.contourArea(contour);
  return contourArea >= areaHoleThreshold;
};

const isContour = (contours: cv.MatVector, index: number) => {
  return {
    ofBackgroundColour: (backgroundColor: number, threshold: number) => {
      return {
        inImage: (image: cv.Mat): boolean => {
          const mask = maskOf(index, contours, image.size());
          const mean = cv.mean(image, mask)[0];
          mask.delete();
          return (
            mean <= backgroundColor + threshold &&
            mean >= backgroundColor - threshold
          );
        },
      };
    },
  };
};

const maskOf = (
  index: number,
  contours: cv.MatVector,
  imageSize: cv.Size
): cv.Mat => {
  let mask = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC1);

  cv.drawContours(
    mask,
    contours,
    index,
    new cv.Scalar(255, 255, 255),
    cv.FILLED
  );
  return mask;
};

export default holeFinder;
