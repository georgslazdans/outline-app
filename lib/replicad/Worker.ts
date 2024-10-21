import ModelData from "./model/ModelData";
import * as Comlink from "comlink";
import { processModelData as processData } from "./ModelProcessor";
import Item from "./model/Item";
import ItemType from "./model/ItemType";
import ReplicadModelData from "./draw/ReplicadModelData";
import { drawItem } from "./draw/Draw";
import { v4 as randomUUID } from "uuid";
import { waitForInitialization } from "./WorkerInitialization";

const asMesh = (data: ReplicadModelData, messageId?: string) => {
  return {
    messageId: messageId ? messageId : randomUUID(),
    faces: data.mesh(),
    edges: data.meshEdges(),
  };
};

const processItem = async (item: Item) => {
  await waitForInitialization();
  if (item.type == ItemType.Group) {
    throw new Error("Group not supported!");
  }
  console.debug("Processing item", item.id, item.type);

  return asMesh(drawItem(item));
};

type ResultCache = {
  key: string | undefined;
  modelPromise: Promise<ReplicadModelData> | undefined;
};

const cachedResult: ResultCache = {
  key: undefined,
  modelPromise: undefined,
};

const replicadModelDataOf = (
  modelData: ModelData
): Promise<ReplicadModelData> => {
  const key = JSON.stringify(modelData);
  let result: Promise<ReplicadModelData>;
  if (key == cachedResult.key && cachedResult.modelPromise) {
    result = cachedResult.modelPromise;
  } else {
    result = new Promise<ReplicadModelData>(async (resolve) => {
      resolve(processData(modelData));
    });
    cachedResult.key = key
    cachedResult.modelPromise = result;
  }
  return result;
};

const processModelData = async (modelData: ModelData) => {
  await waitForInitialization();
  console.debug("Processing modelData", modelData);
  const result = await replicadModelDataOf(modelData);
  return asMesh(result);
};

const downloadStl = async (modelData: ModelData) => {
  await waitForInitialization();
  const result = await replicadModelDataOf(modelData);
  return result.blobSTL({ binary: true });
};

const downloadStep = async (modelData: ModelData) => {
  await waitForInitialization();
  const result = await replicadModelDataOf(modelData);
  return result.blobSTEP();
};

Comlink.expose({ processModelData, processItem, downloadStl, downloadStep });
