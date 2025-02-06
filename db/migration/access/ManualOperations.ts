import { Context } from "@/context/DetailsContext";
import SavedFile from "@/lib/SavedFile";
import using from "./Operations";
import Model from "@/lib/Model";
import { createDatabaseTransaction, DBMode } from "./Transaction";

export const getFile = (database: IDBDatabase, id: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const transaction = createDatabaseTransaction(
      database,
      DBMode.readonly,
      "files",
      resolve,
      reject
    );
    const { getByID } = using<SavedFile>(database, transaction, "files");
    getByID(id).then((it: SavedFile) => {
      resolve(it.blob);
    });
  });
};

export const saveFile = (
  database: IDBDatabase,
  blob: Blob
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const transaction = createDatabaseTransaction(
      database,
      DBMode.readwrite,
      "files",
      resolve,
      reject
    );
    const { add } = using<any>(database, transaction, "files");
    add({ blob: blob }).then((it: number) => {
      resolve(it);
    });
  });
};

export const deleteFile = (
  database: IDBDatabase,
  id: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = createDatabaseTransaction(
      database,
      DBMode.readwrite,
      "files",
      resolve,
      reject
    );
    const { deleteRecord } = using<any>(database, transaction, "files");
    deleteRecord(id).then(() => {
      resolve();
    });
  });
};

export const getAllContext = (database: IDBDatabase): Promise<Context[]> => {
  return new Promise((resolve, reject) => {
    const detailsTransaction = createDatabaseTransaction(
      database,
      DBMode.readonly,
      "details",
      resolve,
      reject
    );
    const { getAll } = using<Context>(database, detailsTransaction, "details");
    getAll().then((it: Context[]) => {
      resolve(it);
    });
  });
};

export const saveContext = (
  database: IDBDatabase,
  context: Context
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = createDatabaseTransaction(
      database,
      DBMode.readwrite,
      "details",
      resolve,
      reject
    );
    const { update } = using<any>(database, transaction, "details");
    update(context).then(() => {
      resolve();
    });
  });
};

export const getAllModels = (database: IDBDatabase): Promise<Model[]> => {
  return new Promise((resolve, reject) => {
    const detailsTransaction = createDatabaseTransaction(
      database,
      DBMode.readonly,
      "models",
      resolve,
      reject
    );
    const { getAll } = using<Model>(database, detailsTransaction, "models");
    getAll().then((it: Model[]) => {
      resolve(it);
    });
  });
};

export const saveModel = (
  database: IDBDatabase,
  model: Model
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = createDatabaseTransaction(
      database,
      DBMode.readwrite,
      "models",
      resolve,
      reject
    );
    const { update } = using<any>(database, transaction, "models");
    update(model).then(() => {
      resolve();
    });
  });
};
