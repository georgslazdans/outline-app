"use client";

import { DBConfig } from "@/db/DbConfig";
import { initDB as initDBHooks } from "react-indexed-db-hook";
import { initializeAndMigrateDb } from "./InitializeDb";

if (window) {
  initializeAndMigrateDb(DBConfig);
  initDBHooks(DBConfig);
}

const IndexedDbContext = () => {
  return <></>;
};

export default IndexedDbContext;
