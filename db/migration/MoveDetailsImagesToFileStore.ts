import Model from "@/lib/Model";
import { MigrationFunction } from "../Migrations";
import using from "./Operations";
import { Context } from "@/context/DetailsContext";

export const moveDetailsImagesToFileStore: MigrationFunction = (
  database: IDBDatabase,
  transaction: IDBTransaction
) => {
  return new Promise<void>((resolve, reject) => {
    updateDetails(database, transaction).then(() =>
      updateModels(database, transaction).then(() => resolve())
    );
  });
};

const updateDetails = async (
  database: IDBDatabase,
  transaction: IDBTransaction
) => {
  return new Promise<void>((resolve, reject) => {
    const { getAll } = using<Context>(database, transaction, "details");
    getAll().then((entries: Context[]) => {
      Promise.all(
        entries.map((entry) => {
          updateDetail(database, transaction, entry);
        })
      ).then(() => resolve());
    });
  });
};

const updateDetail = async (
  database: IDBDatabase,
  transaction: IDBTransaction,
  context: Context
) => {
  const { add: addFile } = using<any>(database, transaction, "files");
  const { update } = using<Context>(database, transaction, "details");
  const updated = { ...context };
  // @ts-expect-error: Expected error during migration from Blob to number.
  if (context.imageFile instanceof Blob) {
    updated.imageFile = await addFile({ blob: context.imageFile });
  }
  // @ts-expect-error: Expected error during migration from Blob to number.
  if (context.paperImage instanceof Blob) {
    updated.paperImage = await addFile({ blob: context.paperImage });
  }
  update(updated);
};

const updateModels = async (
  database: IDBDatabase,
  transaction: IDBTransaction
) => {
  return new Promise<void>((resolve, reject) => {
    const { getAll } = using<Model>(database, transaction, "models");
    getAll().then((entries: Model[]) => {
      Promise.all(
        entries.map((entry) => {
          updateModel(database, transaction, entry);
        })
      ).then(() => resolve());
    });
  });
};

const updateModel = async (
  database: IDBDatabase,
  transaction: IDBTransaction,
  model: Model
) => {
  const { add: addFile } = using<any>(database, transaction, "files");
  const { update } = using<Model>(database, transaction, "models");
  const updated = { ...model };
  // @ts-expect-error: Expected error during migration from Blob to number.
  if (model.imageFile instanceof Blob) {
    updated.imageFile = await addFile({ blob: model.imageFile });
  }
  update(updated);
};
