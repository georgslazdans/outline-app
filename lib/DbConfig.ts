import { IndexedDBProps } from "react-indexed-db-hook";

export const DBConfig: IndexedDBProps = {
  name: "OutlineAppDb",
  version: 1,
  objectStoresMeta: [
    {
      store: "details",
      storeConfig: { keyPath: "name", autoIncrement: false },
      storeSchema: [
      ],
    },
  ],
};
