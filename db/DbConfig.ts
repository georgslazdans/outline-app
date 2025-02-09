import { IndexedDBProps } from "react-indexed-db-hook";

export const DBConfig: IndexedDBProps = {
  name: "OutlineAppDb",
  version: 6,
  objectStoresMeta: [
    {
      store: "details",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "details.name", options: { unique: false } },
      ],
    },
    {
      store: "models",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "preferences",
      storeConfig: { keyPath: "name", autoIncrement: false },
      storeSchema: [],
    },
    {
      store: "files",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [],
    },
  ],
};
