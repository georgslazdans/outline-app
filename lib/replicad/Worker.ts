import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { Point, setOC, Shape3D } from "replicad";
import gridfinityBox from "./models/Gridfinity";
import drawShadow from "./models/OutlineShadow";
import ModelData from "./ModelData";
import {
  BooleanOperation,
  Gridfinity,
  Item,
  ItemGroup,
  ModelType,
  Primitive,
  Shadow,
} from "./Model";
import ReplicadModelData from "./models/ReplicadModelData";
import { eulerToAxisAngle, toDegrees } from "../utils/Math";
import { drawPrimitive } from "./models/Primitives";
import * as Comlink from "comlink";

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

const processItemInternal = (
  item: Gridfinity | Shadow | Primitive | ItemGroup
): ReplicadModelData => {
  switch (item.type) {
    case ModelType.Gridfinity:
      return gridfinityBox(item.params);
    case ModelType.Shadow:
      const { points, height } = item as Shadow;
      return drawShadow(points, height);
    case ModelType.Primitive:
      return drawPrimitive(item.params);
    case ModelType.Group:
      throw new Error();
  }
};

const processFull = (full: ModelData): ReplicadModelData => {
  const processModification = (base: Shape3D, item: Item) => {
    let model = processItemInternal(item);
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

    if (item.booleanOperation == BooleanOperation.UNION) {
      return base.fuse(model as Shape3D);
    } else {
      return base.cut(model as Shape3D);
    }
  };

  if (full.items[0].type != ModelType.Gridfinity) {
    console.warn("First item is not a gridfinity box!");
  }

  let box = processItemInternal(full.items[0]);
  for (let i = 1; i < full.items.length; i++) {
    box = processModification(box as Shape3D, full.items[i]);
  }

  return box;
};

const asMesh = (data: ReplicadModelData, messageId?: string) => {
  return {
    messageId: messageId ? messageId : crypto.randomUUID(),
    faces: data.mesh(),
    edges: data.meshEdges(),
  };
};

const processModelData = async (modelData: ModelData) => {
  await waitForInitialization();
  return asMesh(processFull(modelData));
};

const processItem = async (item: Item) => {
  await waitForInitialization();
  return asMesh(processItemInternal(item));
};

const downloadBlob = async (modelData: ModelData) => {
  await waitForInitialization();
  return processFull(modelData).blobSTL();
};

Comlink.expose({ processModelData, processItem, downloadBlob });
