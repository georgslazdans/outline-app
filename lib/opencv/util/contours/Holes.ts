import * as cv from "@techstark/opencv-js";

import ImageContours, { isParent } from "./Contours";
import ContourPoints, { pointsFrom } from "@/lib/data/contour/ContourPoints";

export type HoleSettings = {
  meanThreshold: number;
  holeAreaThreshold: number;
};

const holeFinder = () => {
  let _image: cv.Mat;
  let _backgroundColor: number;
  let _meanThreshold: number;
  let _holeAreaThreshold: number;

  const result = {
    withImage: (image: cv.Mat) => {
      _image = image;
      return result;
    },
    withSettings: (holeSettings: HoleSettings) => {
      _meanThreshold = holeSettings.meanThreshold;
      _holeAreaThreshold = holeSettings.holeAreaThreshold;
      return result;
    },
    findHolesInContour: (
      imageContours: ImageContours,
      parentIndex: number
    ): number[] => {
      const { contours, hierarchy } = imageContours;
      const backgroundMask = inverseMaskOf(
        parentIndex,
        contours,
        _image.size()
      );
      _backgroundColor = cv.mean(_image, backgroundMask)[0];
      backgroundMask.delete();

      const holeIndexes: number[] = [];

      const parentAreaSize = cv.contourArea(contours.get(parentIndex));
      const areaThreshold = (parentAreaSize / 100) * _holeAreaThreshold;
      for (let i = 0; i < contours.size(); ++i) {
        if (!isParent(i, parentIndex, hierarchy)) {
          continue;
        }

        const contour = contours.get(i);
        const contourArea = cv.contourArea(contour);
        if (
          contourArea >= areaThreshold &&
          isContour(contours, i)
            .ofBackgroundColour(_backgroundColor, _meanThreshold)
            .inImage(_image)
        ) {
          holeIndexes.push(i);
        }
        contour.delete();
      }

      return holeIndexes;
    },
  };

  return result;
};

export const contourPointsOf = (
  imageContours: ImageContours,
  holeIndexes: number[],
  processingFunction: (contour: cv.Mat) => cv.Mat
) => {
  const { contours } = imageContours;
  const contourPoints: ContourPoints[] = [];
  for (const i of holeIndexes) {
    const contour = processingFunction(contours.get(i));
    contourPoints.push(pointsFrom(contour));
  }
  return contourPoints;
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

const inverseMaskOf = (
  index: number,
  contours: cv.MatVector,
  imageSize: cv.Size
): cv.Mat => {
  const mask = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC1);
  const inverseMask = new cv.Mat();
  cv.drawContours(
    mask,
    contours,
    index,
    new cv.Scalar(255, 255, 255),
    cv.FILLED
  );
  cv.bitwise_not(mask, inverseMask);

  mask.delete();
  return inverseMask;
};

export default holeFinder;
