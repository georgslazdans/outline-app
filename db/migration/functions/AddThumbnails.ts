import Model from "@/lib/Model";
import { Context } from "@/context/DetailsContext";
import { scaleImage } from "@/lib/utils/ImageData";
import { AfterUpgradeFunction } from "../AfterUpgrade";
import {
  getFile,
  saveFile,
  saveContext,
  saveModel,
  deleteFile,
  getAllContext,
  getAllModels,
} from "../access/ManualOperations";

export const addThumbnails: AfterUpgradeFunction = (database: IDBDatabase) => {
  return new Promise<void>((resolve, reject) => {
    updateDetails(database).then(() =>
      updateModels(database).then(() => {
        resolve();
      })
    );
  });
};

const updateDetails = (database: IDBDatabase): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    getAllContext(database).then((entries: Context[]) => {
      const promises = entries.map((entry) => updateDetail(database, entry));
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  });
};

const updateDetail = async (database: IDBDatabase, context: Context) => {
  const imageFile = await getFile(database, context.imageFile);
  const thumbnailBlob = await scaleImage(imageFile);
  const thumbnailId = await saveFile(database, thumbnailBlob);
  await saveContext(database, {
    ...context,
    thumbnail: thumbnailId,
  });
};

const updateModels = async (database: IDBDatabase) => {
  return new Promise<void>((resolve, reject) => {
    getAllModels(database).then((entries: Model[]) => {
      const promises = entries.map((entry) => updateModel(database, entry));
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  });
};

const updateModel = async (database: IDBDatabase, model: Model) => {
  if (model.imageFile) {
    const imageFile = await getFile(database, model.imageFile);
    const thumbnailBlob = await scaleImage(imageFile);
    const thumbnailId = await saveFile(database, thumbnailBlob);
    await saveModel(database, {
      ...model,
      imageFile: thumbnailId,
    });
    await deleteFile(database, model.imageFile);
  }
};
