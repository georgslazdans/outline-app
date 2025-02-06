import { moveDetailsImagesToFileStore } from "./migration/MoveDetailsImagesToFileStore";

export type MigrationFunction = (
  database: IDBDatabase,
  transaction: IDBTransaction
) => Promise<void>;

type MigrationEntry = {
  version: number;
  onFreshDatabase: boolean;
  function: MigrationFunction;
};

const MIGRATION_LIST: MigrationEntry[] = [
  {
    version: 4,
    onFreshDatabase: false,
    function: moveDetailsImagesToFileStore,
  },
];

const migrateDatabase = async (
  database: IDBDatabase,
  transaction: IDBTransaction,
  version?: number,
  oldVersion?: number
) => {
  console.log(
    "Performing IndexedDB migration",
    "Old version: " + oldVersion,
    "New Version: " + version
  );
  for (const migration of MIGRATION_LIST) {
    if (!migration.onFreshDatabase && !oldVersion) continue;
    if (!oldVersion || migration.version > oldVersion) {
      console.log("Performing migration:" + migration.function.name);
      await migration.function(database, transaction);
    }
  }
};

export default migrateDatabase;
