import { ContourPoints } from "../Point";
import GridfinityParams from "./params/GridfinityParams";
import PrimitiveParams from "./params/PrimitiveParams";
import Item from "./Item";

export enum BooleanOperation {
  UNION,
  INTERSECTION,
}

enum ModelType {
  Primitive = "primitive",
  Shadow = "shadow",
  Gridfinity = "gridfinity",
  Group = "group",
}

export type Primitive = {
  type: ModelType.Primitive;
  params: PrimitiveParams;
};

export type Shadow = {
  type: ModelType.Shadow;
  points: ContourPoints[];
  height: number;
};

export type Gridfinity = {
  type: ModelType.Gridfinity;
  params: GridfinityParams;
};

export type ItemGroup = {
  type: ModelType.Group;
  items: Item[];
};

export default ModelType;
