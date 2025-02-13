import { Shape3D } from "replicad";
import drawCutBoxes from "./draw/CutBox";
import ReplicadModelData from "./draw/ReplicadModelData";
import GridfinityParams from "./model/item/gridfinity/GridfinityParams";
import SplitCut, { forSplitCut } from "./model/item/gridfinity/SplitCut";
import Point from "../data/Point";

type GridBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type ModelCut = {
  model: ReplicadModelData;
  bounds: GridBounds;
};

const initialCut = (
  model: ReplicadModelData,
  params: GridfinityParams
): ModelCut => {
  return {
    model: model,
    bounds: {
      minX: 0,
      maxX: params.xSize,
      minY: 0,
      maxY: params.ySize,
    },
  };
};

const pointInsideBounds = (point: Point, bounds: GridBounds): boolean => {
  const { x, y } = point;
  return (
    bounds.minX <= x && bounds.maxX >= x && bounds.minY <= y && bounds.maxY >= y
  );
};

const findModelForCut = (cut: SplitCut, modelCuts: ModelCut[]): ModelCut => {
  const modelCut = modelCuts.find((it) => {
    const { bounds } = it;
    const { start, end } = cut;
    return pointInsideBounds(start, bounds) && pointInsideBounds(end, bounds);
  });
  if (!modelCut) {
    console.error("Model not found for cut!", cut, modelCuts);
    throw Error("Model not found for cut!");
  }
  return modelCut;
};

const resultingBotBounds = (cut: SplitCut, bounds: GridBounds): GridBounds => {
  const { isVertical } = forSplitCut(cut);
  if (isVertical()) {
    return {
      minX: bounds.minX,
      maxX: cut.start.x,
      minY: bounds.minY,
      maxY: bounds.maxY,
    };
  } else {
    return {
      minX: bounds.minX,
      maxX: bounds.maxX,
      minY: bounds.minY,
      maxY: cut.start.y,
    };
  }
};

const resultingTopBounds = (cut: SplitCut, bounds: GridBounds): GridBounds => {
  const { isVertical } = forSplitCut(cut);
  if (isVertical()) {
    return {
      minX: cut.start.x,
      maxX: bounds.maxX,
      minY: bounds.minY,
      maxY: bounds.maxY,
    };
  } else {
    return {
      minX: bounds.minX,
      maxX: bounds.maxX,
      minY: cut.start.y,
      maxY: bounds.maxY,
    };
  }
};

const processCut = (
  modelCut: ModelCut,
  cut: SplitCut,
  gridfinityParams: GridfinityParams
): ModelCut[] => {
  const cutBoxes = drawCutBoxes(cut, gridfinityParams) as Shape3D[];
  const { model, bounds } = modelCut;
  return [
    {
      model: (model as Shape3D).cut(cutBoxes[1]),
      bounds: resultingBotBounds(cut, bounds),
    },
    {
      model: (model as Shape3D).cut(cutBoxes[0]),
      bounds: resultingTopBounds(cut, bounds),
    },
  ];
};

const cutModel = (
  result: ReplicadModelData,
  splitCut: SplitCut[],
  gridfinityParams: GridfinityParams
): ReplicadModelData[] => {
  let modelCuts = [initialCut(result, gridfinityParams)];
  splitCut.forEach((cut) => {
    const modelCut = findModelForCut(cut, modelCuts);
    const cuts = processCut(modelCut, cut, gridfinityParams);
    modelCuts = [...modelCuts.filter((it) => it != modelCut), ...cuts];
  });

  return modelCuts.map((it) => it.model);
};

export default cutModel;
