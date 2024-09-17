import opencascade from "replicad-opencascadejs/src/replicad_single.js";
// @ts-ignore
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { loadFont, setOC } from "replicad";
import ModelData from "./model/ModelData";
import * as Comlink from "comlink";
import { processModelData as processData } from "./ModelProcessor";
import Item from "./model/Item";
import ItemType from "./model/ItemType";
import ReplicadModelData from "./draw/ReplicadModelData";
import { drawItem } from "./draw/Draw";
import { v4 as randomUUID } from "uuid";

let initialized = false;

const initializedPromise = new Promise<void>(async (resolve) => {
  if (initialized) {
    resolve();
  } else {
    // @ts-ignore
    const OC = await opencascade({
      locateFile: () => opencascadeWasm,
    });

    setOC(OC);
    await loadFont("/fonts/Roboto-Regular.ttf");
    resolve();
  }
});

const waitForInitialization = async () => {
  await initializedPromise;
};

const asMesh = (data: ReplicadModelData, messageId?: string) => {
  return {
    messageId: messageId ? messageId : randomUUID(),
    faces: data.mesh(),
    edges: data.meshEdges(),
  };
};

const processModelData = async (modelData: ModelData) => {
  await waitForInitialization();
  console.debug("Processing modelData", modelData);
  const result = processData(modelData);
  return asMesh(result);
};

const processItem = async (item: Item) => {
  await waitForInitialization();
  if (item.type == ItemType.Group) {
    throw new Error("Group not supported!");
  }
  console.debug("Processing item", item.id, item.type);

  return asMesh(drawItem(item));
};

const downloadBlob = async (modelData: ModelData) => {
  await waitForInitialization();
  throw new Error("Oppsie!");
  return processData(modelData).blobSTL();
};

Comlink.expose({ processModelData, processItem, downloadBlob });
