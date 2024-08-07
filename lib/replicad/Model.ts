import GridfinityParams from "./GridfinityParams";

enum BooleanOperation {
  UNION,
  INTERSECTION,
}

type BooleanModifier = {
  type: BooleanOperation;
};

