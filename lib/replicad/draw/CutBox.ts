import { drawRectangle } from "replicad";
import GridfinityParams from "../model/item/gridfinity/GridfinityParams";
import SplitCut, { forSplitCut } from "../model/item/gridfinity/SplitCut";
import ReplicadModelData from "./ReplicadModelData";

const OFFSET = 10;

const drawBox = (
  width: number,
  length: number,
  height: number
): ReplicadModelData => {
  return drawRectangle(width, length).sketchOnPlane().extrude(height);
};

const drawCutBoxes = (splitCut: SplitCut, params: GridfinityParams) => {
  const { gridSize, height, xSize, ySize } = params;

  const totalXSize = gridSize * xSize;
  const totalYSize = gridSize * ySize;

  const totalHeight = 2 * height * 7 + 7 * 100000;

  if (forSplitCut(splitCut).isVertical()) {
    const planeYSize = (splitCut.end.y - splitCut.start.y) * gridSize + OFFSET;
    const xPosition = gridSize * splitCut.start.x;
    const yPosition = gridSize * splitCut.start.y;

    const firstHalfWidth = splitCut.start.x * gridSize;
    const secondHalfWidth = (xSize - splitCut.start.x) * gridSize;

    const firstBox = drawBox(
      planeYSize,
      totalHeight * 2,
      firstHalfWidth + OFFSET
    )
      .rotate(90, [0, 0, 0], [1, 0, 0])
      .rotate(-90, [0, 0, 0], [0, 0, 1]);
    const secondBox = drawBox(
      planeYSize,
      totalHeight * 2,
      secondHalfWidth + OFFSET
    )
      .rotate(90, [0, 0, 0], [1, 0, 0])
      .rotate(90, [0, 0, 0], [0, 0, 1]);

    return [firstBox, secondBox].map((box) => {
      return box
        .translate(
          -totalXSize / 2,
          -totalYSize / 2 + planeYSize / 2,
          totalHeight / 2
        )
        .translate(xPosition, yPosition, 0);
    });
  } else {
    const planeXSize = (splitCut.end.x - splitCut.start.x) * gridSize + OFFSET;
    const xPosition = gridSize * splitCut.start.x;
    const yPosition = gridSize * splitCut.start.y;

    const firstHalfWidth = splitCut.start.y * gridSize;
    const secondHalfWidth = (ySize - splitCut.start.y) * gridSize;

    const firstBox = drawBox(
      planeXSize,
      totalHeight * 2,
      firstHalfWidth + OFFSET
    ).rotate(90, [0, 0, 0], [1, 0, 0]);
    const secondBox = drawBox(
      planeXSize,
      totalHeight * 2,
      secondHalfWidth + OFFSET
    ).rotate(-90, [0, 0, 0], [1, 0, 0]);

    return [firstBox, secondBox].map((box) => {
      return box
        .translate(
          -totalXSize / 2 + planeXSize / 2,
          -totalYSize / 2,
          totalHeight / 2
        )
        .translate(xPosition, yPosition, 0);
    });
  }
};

export default drawCutBoxes;
