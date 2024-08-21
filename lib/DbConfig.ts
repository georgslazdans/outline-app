import { IndexedDBProps } from "react-indexed-db-hook";

export const DBConfig: IndexedDBProps = {
  name: "OutlineAppDb",
  version: 1,
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
  ],
};
