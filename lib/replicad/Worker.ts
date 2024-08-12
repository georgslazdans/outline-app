import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC, Shape3D, ShapeMesh } from "replicad";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";
import gridfinityBox from "./models/Gridfinity";
import drawShadow from "./models/OutlineShadow";
import { FullModel, ReplicadWork } from "./Work";
import { Item, Shadow } from "./Model";
import ReplicadModelData from "./models/ReplicadModelData";

export type ReplicadResult = {
  id: string;
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
  messageId?: number;
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

const processItem = (item: Item): ReplicadModelData => {
  switch (item.type) {
    case "gridfinity":
      return gridfinityBox(item.params);

    case "shadow":
      const { points, height } = item as Shadow;
      return drawShadow(points, height);

    case "primitive":
      throw new Error("Not Implemented!");
  }
};

const processFull = (full: FullModel) => {
  const processModification = (base: Shape3D, item: Item) => {
    // const offsetToTop =
    //   42 * full.gridfinity.params.height - modification.height;
    let model = processItem(item);
    if (item.translation) {
      const { x, y, z } = item.translation;
      model = model.translate(x, y, z);
    }
    return base.cut(model as Shape3D);
  };

  if (full.items[0].type != "gridfinity") {
    console.warn("First item is not a gridfinity box!");
  }

  let box = processItem(full.items[0]);
  for (let i = 1; i < full.items.length; i++) {
    box = processModification(box as Shape3D, full.items[i]);
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
      const result = processItem(work.item);
      return {
        id: work.item.id,
        faces: result.mesh(),
        edges: result.meshEdges(),
      };
    case "download":
      throw new Error("Not Implemented!");
  }
};

addEventListener("message", async (event: MessageEvent<ReplicadWork>) => {
  await waitForInitialization();
  const work = event.data;

  const result = processWork(work);

  postMessage(result);
});
