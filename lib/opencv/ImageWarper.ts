import * as cv from "@techstark/opencv-js";
import Point from "../Point";

const coordinatesOfImage = (paperCorners: Point[]) => {
  // Sort the corners in order: top-left, top-right, bottom-right, bottom-left
  //corners = corners.sort((a, b) => a.y - b.y);
  const points = paperCorners.sort((a, b) => a.y - b.y);
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

const coordinatesOfPaper = (paperWidth: number, paperHeight: number) => {
  return cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    paperWidth,
    0,
    paperWidth,
    paperHeight,
    0,
    paperHeight,
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
    withPaperSize: (width: number, height: number) => {
      const paperCorners = coordinatesOfPaper(width, height);
      const imageSize = new cv.Size(width, height);

      return {
        andPaperContour: (contour: Point[]) => {
          const imageCorners = coordinatesOfImage(contour);
          return {
            warpImage: (image: cv.Mat) => {
              const transformMatrix = cv.getPerspectiveTransform(
                imageCorners,
                paperCorners
              );
              const result = applyTransform(transformMatrix, image, imageSize);

              imageCorners.delete();
              paperCorners.delete();
              transformMatrix.delete();

              return result;
            },
            // TODO image size should be the original, intead of the paper
            reverseWarpImage: (image: cv.Mat, imageSize: cv.Size) => {
              const transformMatrix = cv.getPerspectiveTransform(
                paperCorners,
                imageCorners
              );
              const result = applyTransform(transformMatrix, image, imageSize);

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
