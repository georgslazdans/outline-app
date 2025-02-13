import { ShapeMesh } from "replicad";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";

export type ReplicadMeshData = {
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
};
type ReplicadResult = {
  messageId: string;
  models: ReplicadMeshData[];
};

export default ReplicadResult;
