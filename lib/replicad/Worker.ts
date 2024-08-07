import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC, Shape3D, ShapeMesh } from "replicad";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";
import gridfinityBox from "./models/Gridfinity";
import drawShadow from "./models/OutlineShadow";
import { Full, Gridfinity, Model, ReplicadWork, Shadow } from "./Work";

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

const processModel = (model: Gridfinity | Shadow) => {
  let result;
  switch (model.type) {
    case "gridfinity":
      result = gridfinityBox(model.params);
    case "shadow":
      const { points, height } = model as Shadow;
      result = drawShadow(points, height);
  }
  return {
    faces: result.mesh(),
    edges: result.meshEdges(),
  };
};

const processFull = (full: Full) => {
  const box = gridfinityBox(full.gridfinity.params);
  const offsetToTop = 42 * full.gridfinity.params.height - full.shadow.height;
  // const offsetToTop = -5;
  const shadow = drawShadow(full.shadow.points, full.shadow.height).translateZ(
    offsetToTop
  );
  const result = (box as Shape3D).cut(shadow as Shape3D);
  return {
    faces: result.mesh(),
    edges: result.meshEdges(),
  };
};

const processWork = (work: ReplicadWork) => {
  switch (work.type) {
    case "full":
      return processFull(work);
    case "model":
      return processModel(work.value);
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
