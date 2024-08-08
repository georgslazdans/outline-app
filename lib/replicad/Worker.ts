import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC, Shape3D, ShapeMesh } from "replicad";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";
import gridfinityBox from "./models/Gridfinity";
import drawShadow from "./models/OutlineShadow";
import { FullModel, Gridfinity, ModelPart, ReplicadWork, Shadow } from "./Work";

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

const processFull = (full: FullModel) => {
  const processModification = (original: Shape3D, modification: Shadow) => {
    const offsetToTop =
      42 * full.gridfinity.params.height - modification.height;
    // const offsetToTop = -5;
    const shadow = drawShadow(
      modification.points,
      modification.height
    ).translateZ(offsetToTop);
    return original.cut(shadow as Shape3D);
  };
  let box = gridfinityBox(full.gridfinity.params);
  for (let i = 0; i < full.modifications.length; i++) {
    box = processModification(box as Shape3D, full.modifications[i] as Shadow);
  }
  return {
    faces: box.mesh(),
    edges: box.meshEdges(),
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
