import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import ModelData from "./ModelData";
import {
  Item,
} from "./Model";
import ReplicadModelData from "./models/ReplicadModelData";
import * as Comlink from "comlink";
import { modelOf, processModelData as processData } from "./Processor";

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
  return asMesh(modelOf(item));
};

const downloadBlob = async (modelData: ModelData) => {
  await waitForInitialization();
  return processData(modelData).blobSTL();
};

Comlink.expose({ processModelData, processItem, downloadBlob });
