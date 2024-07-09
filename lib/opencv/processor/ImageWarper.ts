import * as cv from "@techstark/opencv-js";
import Point from "../../Point";
import { PaperDimensions } from "../PaperSettings";

const scaleFactorOf = (
  imageSize: cv.Size,
  paperDimensions: PaperDimensions
): number => {
  const widthScaleFactor = imageSize.width / paperDimensions.width;
  const heightScaleFactor = imageSize.height / paperDimensions.height;
  return Math.min(widthScaleFactor, heightScaleFactor);
};

const calculateWarpedImagedSize = (
  scaleFactor: number,
  paperDimensions: PaperDimensions
) => {
  return {
    width: Math.floor(paperDimensions.width * scaleFactor),
    height: Math.floor(paperDimensions.height * scaleFactor),
  };
};

const coordinatesOfImage = (paperCorners: Point[]) => {
  // Sort the corners in order: top-left, top-right, bottom-right, bottom-left
  //corners = corners.sort((a, b) => a.y - b.y);
  const points = [...paperCorners].sort((a, b) => a.y - b.y);
  let topLeft = points[0].x < points[1].x ? points[0] : points[1];
  let topRight = points[0].x > points[1].x ? points[0] : points[1];
  let bottomLeft = points[2].x < points[3].x ? points[2] : points[3];
  let bottomRight = points[2].x > points[3].x ? points[2] : points[3];

  return cv.matFromArray(4, 1, cv.CV_32FC2, [
    topLeft.x,
    topLeft.y,
    topRight.x,
    topRight.y,
    bottomRight.x,
    bottomRight.y,
    bottomLeft.x,
    bottomLeft.y,
  ]);
};

const coordinatesOfPaper = (
  paperDimensions: PaperDimensions,
  scaleFactor: number = 1
) => {
  return cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    paperDimensions.width * scaleFactor,
    0,
    paperDimensions.width * scaleFactor,
    paperDimensions.height * scaleFactor,
    0,
    paperDimensions.height * scaleFactor,
  ]);
};

const applyTransform = (
  transformMatrix: cv.Mat,
  image: cv.Mat,
  imageSize: cv.Size
) => {
  let warped = new cv.Mat();
  cv.warpPerspective(image, warped, transformMatrix, imageSize);
  return warped;
};

const imageWarper = () => {
  return {
    withPaperSize: (paperSize: PaperDimensions) => {
      return {
        andPaperContour: (contour: Point[]) => {
          const imageCorners = coordinatesOfImage(contour);
          return {
            warpImage: (image: cv.Mat) => {
              const scaleFactor = scaleFactorOf(image.size(), paperSize);
              const paperCorners = coordinatesOfPaper(paperSize, scaleFactor);

              const transformMatrix = cv.getPerspectiveTransform(
                imageCorners,
                paperCorners
              );

              const result = applyTransform(
                transformMatrix,
                image,
                calculateWarpedImagedSize(scaleFactor, paperSize)
              );

              imageCorners.delete();
              paperCorners.delete();
              transformMatrix.delete();

              return result;
            },
            reverseWarpImage: (image: cv.Mat, originalImageSize: cv.Size) => {
              const scaleFactor = scaleFactorOf(originalImageSize, paperSize);
              const paperCorners = coordinatesOfPaper(paperSize, scaleFactor);
              const transformMatrix = cv.getPerspectiveTransform(
                paperCorners,
                imageCorners
              );
              const result = applyTransform(
                transformMatrix,
                image,
                originalImageSize
              );

              imageCorners.delete();
              paperCorners.delete();
              transformMatrix.delete();

              return result;
            },
          };
        },
      };
    },
  };
};

export default imageWarper;
