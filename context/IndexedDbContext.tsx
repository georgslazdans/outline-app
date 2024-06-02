"use client";

import { DBConfig } from "@/lib/DbConfig";
import { useEffect } from "react";
import { initDB } from "react-indexed-db-hook";

if (window) {
  initDB(DBConfig);
}

const IndexedDbContext = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      //@ts-ignore
      global.window = {}
    }

    // if()
    // if (typeof window !== "undefined") {
    // }
  });
  return <></>;
};

export default IndexedDbContext;