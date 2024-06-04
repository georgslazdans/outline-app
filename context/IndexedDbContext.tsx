"use client";

import { DBConfig } from "@/lib/DbConfig";
import { initDB } from "react-indexed-db-hook";

if (window) {
  initDB(DBConfig);
}

const IndexedDbContext = () => {
  return <></>;
};

export default IndexedDbContext;
