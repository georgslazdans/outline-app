import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC, ShapeMesh } from "replicad";
import drawBox from "./models/Box";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";
import gridfinityBox from "./models/Gridfinity";
import { ContourPoints } from "../Point";
import drawShadow from "./models/OutlineShadow";
import { Gridfinity, Model, ReplicadWork, Shadow } from "./Work";
import ModelData from "./models/ModelData";

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

const processModel = (model: Gridfinity | Shadow): ModelData => {
  switch (model.type) {
    case "gridfinity":
      return gridfinityBox(model.params);
    case "shadow":
      return drawShadow(model.points, model.height);
  }
};

const processWork = (work: ReplicadWork) => {
  switch (work.type) {
    case "full":
      // TODO
      break;
    case "model":
      const result = processModel(work.value);
      return {
        faces: result.mesh(),
        edges: result.meshEdges(),
      };
    case "download":
      break;
  }
};

addEventListener("message", async (event: MessageEvent<ReplicadWork>) => {
  await waitForInitialization();
  const work = event.data;

  const result = processWork(work);

  postMessage(result);
});
