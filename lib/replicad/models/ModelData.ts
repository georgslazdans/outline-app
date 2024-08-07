import {
  Compound,
  CompSolid,
  Edge,
  Face,
  Shell,
  Solid,
  Vertex,
  Wire,
} from "replicad";

type ModelData =
  | Shell
  | Solid
  | CompSolid
  | Compound
  | Vertex
  | Edge
  | Wire
  | Face;

export default ModelData;
