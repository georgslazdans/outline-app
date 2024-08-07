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
  gridfinityParams: Gridfinity;
  shadow: Shadow;
};

export type Full = {
  type: "full";
} & Complete;

export type Download = {
  type: "download";
} & Full;

export type ReplicadWork = Model | Full | Download;
