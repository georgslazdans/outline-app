import {
  IndexedDBProps,
  ObjectStoreMeta,
  ObjectStoreSchema,
} from "react-indexed-db-hook";
import migrateDatabase from "./Migrations";

// Customized from source to support executing migrations
// https://github.com/assuncaocharles/react-indexed-db/blob/master/src/indexed-db.ts
export const initializeAndMigrateDb = (props: IndexedDBProps) => {
  const { name: dbName, version, objectStoresMeta: storeSchemas } = props;
  const request: IDBOpenDBRequest = indexedDB.open(dbName, version);

  request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
    const database: IDBDatabase = (event.target as any).result;
    storeSchemas.forEach((storeSchema: ObjectStoreMeta) => {
      if (!database.objectStoreNames.contains(storeSchema.store)) {
        const objectStore = database.createObjectStore(
          storeSchema.store,
          storeSchema.storeConfig
        );
        storeSchema.storeSchema.forEach((schema: ObjectStoreSchema) => {
          objectStore.createIndex(schema.name, schema.keypath, schema.options);
        });
      }
    });
    
    const transaction = (event.target as any).transaction as IDBTransaction;
    migrateDatabase(
      database,
      transaction,
      event.newVersion!,
      event.oldVersion
    ).then(() => {
      database.close();
    });
  };
  request.onsuccess = function (e: any) {
    e.target.result.close();
  };
};
