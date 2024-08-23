import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import ModelData from "./model/ModelData";
import * as Comlink from "comlink";
import { processModelData as processData } from "./Processor";
import Item from "./model/Item";
import ItemType from "./model/ItemType";
import ReplicadModelData from "./draw/ReplicadModelData";
import { drawItem } from "./draw/Draw";

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

const asMesh = (data: ReplicadModelData, messageId?: string) => {
  return {
    messageId: messageId ? messageId : crypto.randomUUID(),
    faces: data.mesh(),
    edges: data.meshEdges(),
  };
};

const processModelData = async (modelData: ModelData) => {
  await waitForInitialization();
  return asMesh(processData(modelData));
};

const processItem = async (item: Item) => {
  await waitForInitialization();
  if (item.type == ItemType.Group) {
    throw new Error("Group not supported!");
  }
  return asMesh(drawItem(item));
};

const downloadBlob = async (modelData: ModelData) => {
  await waitForInitialization();
  return processData(modelData).blobSTL();
};

Comlink.expose({ processModelData, processItem, downloadBlob });
