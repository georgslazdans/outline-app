import { Context } from "@/context/DetailsContext";
import { imageDataToBlob } from "@/lib/utils/ImageData";
import { AfterUpgradeFunction } from "../AfterUpgrade";
import {
  saveFile,
  saveContext,
  getAllContext,
} from "../access/ManualOperations";

export const changePaperImageDataToSavedFile: AfterUpgradeFunction = (database: IDBDatabase) => {
  return new Promise<void>((resolve, reject) => {
    updateDetails(database).then(() => {
      resolve();
    });
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
  // @ts-expect-error: Expected error during migration from Blob to number.
  if (context.paperImage instanceof ImageData) {
    const paperImageBlob = await imageDataToBlob(context.paperImage);
    if (paperImageBlob) {
      const paperImageId = await saveFile(database, paperImageBlob);
      await saveContext(database, {
        ...context,
        paperImage: paperImageId,
      });
    }
  }
};
