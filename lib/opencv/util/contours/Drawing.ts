import * as cv from "@techstark/opencv-js";
import ImageContours, { largestContourOf } from "./Contours";
import Point from "@/lib/Point";
import { ContourPoints } from "../../StepResult";

const PRIMARY_COLOR = new cv.Scalar(218, 65, 103);

export const contourShapeOf = (contours: ContourPoints[]) => {
  let color = PRIMARY_COLOR;
  let imageDataType = cv.CV_8UC4;
  const drawImage = {
    withColour: (newColour: cv.Scalar) => {
      color = newColour;
      return drawImage;
    },
    asRGB: () => {
      imageDataType = cv.CV_8UC3;
      return drawImage;
    },
    drawImageOfSize: (size: cv.Size) =>
      drawContourShapes(contours, size, color, imageDataType),
  };
  return drawImage;
};

const drawContourShapes = (
  contours: ContourPoints[],
  size: cv.Size,
  color = PRIMARY_COLOR,
  imageDataType: number
) => {
  const image = cv.Mat.zeros(size.height, size.width, imageDataType);
  contours.forEach((it) => {
    drawPolylines(it.points, image, color);
  });
  return image;
};

const drawPolylines = (points: Point[], image: cv.Mat, color: cv.Scalar) => {
  const strokeWidth = 15;
  const closed = true;

  const markersVector = new cv.MatVector();
  const mv = new cv.Mat(points.length, 1, cv.CV_32SC2);
  points.forEach(({ x, y }, idx) => {
    mv.intPtr(idx, 0)[0] = x;
    mv.intPtr(idx, 0)[1] = y;
  });
  markersVector.push_back(mv);

  cv.polylines(image, markersVector, closed, color, strokeWidth);

  markersVector.delete();
  mv.delete();
};

export const drawLargestContour = (
  imageSize: cv.Size,
  contours: cv.MatVector,
  hierarchy: cv.Mat
) => {
  const largestContourIndex = largestContourOf(contours);

  let contourImg = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    if (largestContourIndex != i) continue;
    let color = new cv.Scalar(218, 65, 103); // Primary colour
    cv.drawContours(
      contourImg,
      contours,
      i,
      color,
      10,
      cv.LINE_8,
      hierarchy,
      100
    );
  }
  return contourImg;
};

// Debug drawing

export const drawAllContours = (
  imageSize: cv.Size,
  imageContours: ImageContours
): cv.Mat => {
  const { contours, hierarchy } = imageContours;

  const colorMap: { [key: number]: cv.Scalar } = {};

  // Create a color image to draw contours
  let contourImg = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    const hierarchyIndex = hierarchy.intPtr(0, i)[3]; // parent contour index

    if (!(hierarchyIndex in colorMap)) {
      colorMap[hierarchyIndex] = new cv.Scalar(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255)
      );
    }

    const color = colorMap[hierarchyIndex];

    cv.drawContours(
      contourImg,
      contours,
      i,
      color,
      1,
      cv.LINE_8,
      hierarchy,
      100
    );
  }
  return contourImg;
};

export const drawAllContoursChild = (
  imageSize: cv.Size,
  imageContours: ImageContours,
  parentIndex: number
): cv.Mat => {
  const { contours, hierarchy } = imageContours;

  const colorMap: { [key: number]: cv.Scalar } = {};

  // Create a color image to draw contours
  let contourImg = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    const hierarchyIndex = hierarchy.intPtr(0, i)[3]; // parent contour index
    if (hierarchyIndex != parentIndex && i != parentIndex) {
      continue;
    }

    if (!(hierarchyIndex in colorMap)) {
      colorMap[hierarchyIndex] = new cv.Scalar(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255)
      );
    }

    const color = colorMap[hierarchyIndex];

    cv.drawContours(
      contourImg,
      contours,
      i,
      color,
      1,
      cv.LINE_8,
      hierarchy,
      100
    );
  }
  return contourImg;
};
