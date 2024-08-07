import { ContourPoints } from "../Point";
import GridfinityParams from "./GridfinityParams";

export type Shadow = {
  type: "shadow";
  points: ContourPoints[];
  height: number;
};

export type Gridfinity = {
  type: "gridfinity";
  params: GridfinityParams;
};

export type Model = {
  type: "model";
  value: Shadow | Gridfinity;
};

export type Complete = {
  gridfinity: Gridfinity;
  shadow: Shadow;
};

export type Full = {
  type: "full";
} & Complete;

export type Download = {
  type: "download";
} & Full;

export type ReplicadWork = Model | Full | Download;

export const modelWorkOf = (contourPoints: ContourPoints[]): Model => {
  return {
    type: "model",
    value: {
      type: "shadow",
      points: contourPoints,
      height: 10,
    },
  };
};

export const fullWorkOf = (contourPoints: ContourPoints[]): Full => {
  return {
    type: "full",
    gridfinity: {
      type: "gridfinity",
      params: {
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
      },
    },
    shadow: {
      type: "shadow",
      points: contourPoints,
      height: 10,
    },
  };
};
