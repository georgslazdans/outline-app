import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { Point, setOC, Shape3D, ShapeMesh } from "replicad";
import { ReplicadMeshedEdges } from "replicad-threejs-helper";
import gridfinityBox from "./models/Gridfinity";
import drawShadow from "./models/OutlineShadow";
import { ModelData, ReplicadWork } from "./Work";
import { Item, Shadow } from "./Model";
import ReplicadModelData from "./models/ReplicadModelData";
import deepEqual from "../utils/Objects";
import Point3D from "../Point3D";
import { Euler } from "three";
import { eulerToAxisAngle, toDegrees } from "../utils/Math";

export type ReplicadResultProps = {
  id: string;
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
  messageId?: number;
};

export type ReplicadResult = ReplicadResultProps | Blob;

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

const processFull = (full: ModelData): ReplicadModelData => {
  const processModification = (base: Shape3D, item: Item) => {
    let model = processItem(item);
    if (item.rotation) {
      const axisRotation = eulerToAxisAngle(item.rotation);
      const axis = [
        axisRotation.axis.x,
        axisRotation.axis.y,
        axisRotation.axis.z,
      ] as Point;
      model = model.rotate(toDegrees(axisRotation.angle), [0, 0, 0], axis);
    }
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

  return box;
};

const asMesh = (data: ReplicadModelData, id?: string) => {
  return {
    id: id ? id : crypto.randomUUID(),
    faces: data.mesh(),
    edges: data.meshEdges(),
  };
};

const processWork = (work: ReplicadWork) => {
  switch (work.type) {
    case "full":
      return asMesh(processFull(work));
    case "model":
      return asMesh(processItem(work.item), work.item.id);
    case "download":
      return processFull(work).blobSTL();
  }
};

addEventListener("message", async (event: MessageEvent<ReplicadWork>) => {
  await waitForInitialization();
  const work = event.data;

  const result = processWork(work);

  postMessage(result);
});
