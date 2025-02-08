import { moveDetailsImagesToFileStore } from "./functions/MoveDetailsImagesToFileStore";

export type UpgradeMigrationFunction = (
  database: IDBDatabase,
  transaction: IDBTransaction
) => Promise<void>;

type UpgradeMigrationEntry = {
  version: number;
  onFreshDatabase: boolean;
  function: UpgradeMigrationFunction;
};

const MIGRATION_LIST: UpgradeMigrationEntry[] = [
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
