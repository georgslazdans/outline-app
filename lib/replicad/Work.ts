import { ContourPoints } from "../Point";
import GridfinityParams from "./GridfinityParams";

export type Primitive = {
  type: "primitive";
  params: any; // TODO add enum and param types
};

export type Shadow = {
  type: "shadow";
  points: ContourPoints[];
  height: number;
};

export type Gridfinity = {
  type: "gridfinity";
  params: GridfinityParams;
};

export type ModelPart = {
  type: "model";
  value: Shadow | Gridfinity;
};

export type Complete = {
  gridfinity: Gridfinity;
  modifications: (Shadow | Primitive)[];
};

export type FullModel = {
  type: "full";
} & Complete;

export type Download = {
  type: "download";
} & FullModel;

export type ReplicadWork = ModelPart | FullModel | Download;

export const gridfinityModelOf = (params: GridfinityParams): ModelPart => {
  return {
    type: "model",
    value: {
      type: "gridfinity",
      params: params,
    },
  };
};

export const modelWorkOf = (contourPoints: ContourPoints[]): ModelPart => {
  return {
    type: "model",
    value: {
      type: "shadow",
      points: contourPoints,
      height: 10,
    },
  };
};

export const defaultGridfinityParams = (): GridfinityParams => {
  return {
    xSize: 5,
    ySize: 2,
    height: 0.5, // TODO use standard units of 7mm
    keepFull: true,
    wallThickness: 1.2,
    withMagnet: false,
    withScrew: false,
    magnetRadius: 3.25,
    magnetHeight: 2,
    screwRadius: 1.5,
  };
};

export const fullWorkOf = (
  contourPoints: ContourPoints[],
  gridfinityParams: GridfinityParams
): FullModel => {
  return {
    type: "full",
    gridfinity: {
      type: "gridfinity",
      params: gridfinityParams,
    },
    modifications: [
      {
        type: "shadow",
        points: contourPoints,
        height: 10,
      },
    ],
  };
};
