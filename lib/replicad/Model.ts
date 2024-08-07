import GridfinityParams from "./GridfinityParams";

enum BooleanOperation {
  UNION,
  INTERSECTION,
}

type ModelPart = {
  model: any;
  transform: any;
};

type ModelTask = {
  gridfinityParams: GridfinityParams;
  modifiers: BooleanModifier[];
};

type BooleanModifier = {
  type: BooleanOperation;
  model: ModelPart;
};

