import { addThumbnails } from "./functions/AddThumbnails";

export type AfterUpgradeFunction = (database: IDBDatabase) => Promise<void>;

type UpgradeMigrationEntry = {
  version: number;
  onFreshDatabase: boolean;
  function: AfterUpgradeFunction;
};

const MIGRATION_LIST: UpgradeMigrationEntry[] = [
  {
    version: 4,
    onFreshDatabase: false,
    function: addThumbnails,
  },
];

const afterUpgradeMigration = async (
  database: IDBDatabase,
  oldVersion?: number
) => {
  console.log(
    "Performing IndexedDB after upgrade migration",
    "Old version: " + oldVersion
  );
  for (const migration of MIGRATION_LIST) {
    if (!migration.onFreshDatabase && !oldVersion) continue;
    if (!oldVersion || migration.version > oldVersion) {
      console.log("Performing after upgrade migration:" + migration.function.name);
      await migration.function(database);
    }
  }
};

export default afterUpgradeMigration;
