import Model from "@/lib/Model";
import { AfterUpgradeFunction } from "../AfterUpgrade";
import {
  saveModel,
  getAllModels,
} from "../access/ManualOperations";
import ItemType from "@/lib/replicad/model/ItemType";

export const changeGridfinityHeightToStandard: AfterUpgradeFunction = (
  database: IDBDatabase
) => {
  return new Promise<void>((resolve, reject) => {
    updateModels(database).then(() => {
      resolve();
    });
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
  const newItems = model.modelData.items.map((item) => {
    if (item.type == ItemType.Gridfinity) {
      const newHeight = (42 * item.params.height) / 7;
      return {
        ...item,
        params: { ...item.params, height: newHeight },
      };
    } else {
      return item;
    }
  });
  await saveModel(database, {
    ...model,
    modelData: {
      ...model.modelData,
      items: newItems,
    },
  });
};
