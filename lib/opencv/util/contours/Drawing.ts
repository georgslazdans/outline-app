import * as cv from "@techstark/opencv-js";
import ImageContours, { largestContourOf } from "./Contours";
import Point, { ContourPoints } from "@/lib/Point";

const PRIMARY_COLOR = new cv.Scalar(218, 65, 103);

export const contourShapeOf = (contours: ContourPoints[]) => {
  let color = PRIMARY_COLOR;
  const drawImage = {
    withColour: (newColour: cv.Scalar) => {
      color = newColour;
      return drawImage;
    },
    drawImageOfSize: (size: cv.Size): cv.Mat =>
      drawContourShapes(contours, size, color),
  };
  return drawImage;
};

const drawContourShapes = (
  contours: ContourPoints[],
  size: cv.Size,
  color: cv.Scalar
) => {
  const image = cv.Mat.zeros(size.height, size.width, cv.CV_8UC3);
  contours.forEach((it) => {
    drawPolylines(it.points, image, color);
  });
  return image;
};

const drawPolylines = (points: Point[], image: cv.Mat, color: cv.Scalar) => {
  const markersVector = new cv.MatVector();
  const mv = new cv.Mat(points.length, 1, cv.CV_32SC2);
  points.forEach(({ x, y }, idx) => {
    mv.intPtr(idx, 0)[0] = x;
    mv.intPtr(idx, 0)[1] = y;
  });
  markersVector.push_back(mv);

  const strokeWidth = 15;
  const closed = true;
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
  parentIndex: number,
  color: cv.Scalar,
  lineThickness: number
): cv.Mat => {
  const { contours, hierarchy } = imageContours;
  let contourImg = cv.Mat.zeros(imageSize.height, imageSize.width, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    const hierarchyIndex = hierarchy.intPtr(0, i)[3]; // parent contour index
    if (hierarchyIndex != parentIndex || i == parentIndex) {
      continue;
    }
    cv.drawContours(
      contourImg,
      contours,
      i,
      color,
      lineThickness,
      cv.LINE_8,
      hierarchy,
      100
    );
  }
  return contourImg;
};
