import { ShapeMesh } from "replicad";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";

type ReplicadResult = {
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
  messageId: number;
};

export default ReplicadResult;
