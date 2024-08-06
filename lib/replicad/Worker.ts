import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC, ShapeMesh } from "replicad";
import drawBox from "./Box";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";

export type ReplicadResult = {
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
};

let initialized = false;

const initializedPromise = new Promise<void>(async (resolve) => {
  if (initialized) {
    resolve();
  } else {
    const OC = await opencascade({
      locateFile: () => opencascadeWasm,
    });

    setOC(OC);
    resolve();
  }
});

const waitForInitialization = async () => {
  await initializedPromise;
};

addEventListener("message", async (event: MessageEvent<any>) => {
  console.log("Init worker");
  await waitForInitialization();
  const work = event.data;
  const result = drawBox(10);
  console.log("Types", typeof result.mesh(), typeof result.meshEdges());
  postMessage({
    faces: result.mesh(),
    edges: result.meshEdges(),
  });
});
