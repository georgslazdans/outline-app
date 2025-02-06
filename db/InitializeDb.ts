import {
  IndexedDBProps,
  ObjectStoreMeta,
  ObjectStoreSchema,
} from "react-indexed-db-hook";
import migrateDatabase from "./migration/Migrations";
import afterUpgradeMigration from "./migration/AfterUpgrade";

// Customized from source to support executing migrations
// https://github.com/assuncaocharles/react-indexed-db/blob/master/src/indexed-db.ts
export const initializeAndMigrateDb = (props: IndexedDBProps) => {
  const { name: dbName, version, objectStoresMeta: storeSchemas } = props;
  const request: IDBOpenDBRequest = indexedDB.open(dbName, version);

  let pendingOldVersion: number | null = null;
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
    pendingOldVersion = event.oldVersion;

    const transaction = (event.target as any).transaction as IDBTransaction;
    migrateDatabase(
      database,
      transaction,
      event.newVersion!,
      event.oldVersion
    ).then(() => {});
  };

  request.onsuccess = async function (e: any) {
    const database: IDBDatabase = e.target.result;
    if (pendingOldVersion) {
      await afterUpgradeMigration(database, pendingOldVersion);
    }
    database.close();
  };
};
