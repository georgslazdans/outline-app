"use client";

import { DBConfig } from "@/db/DbConfig";
import { initDB as initDBHooks } from "react-indexed-db-hook";
import { initializeAndMigrateDb } from "./InitializeDb";
import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState } from "react";
import useDebounced from "@/lib/utils/Debounced";

const initializeDb = (async () => {
  if (window) {
    const migration = initializeAndMigrateDb(DBConfig);
    initDBHooks(DBConfig);
    await migration;
  }
})();

const IndexedDbContext = () => {
  const { setLoading } = useLoading();
  const [isInitialized, setIsInitialized] = useState(false);
  const { onChange: setLoadingDebounced } = useDebounced(setLoading, 200);

  useEffect(() => {
    setLoadingDebounced(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      setLoadingDebounced(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    const init = async () => {
      await initializeDb;
      setIsInitialized(true);
    };
    init();
  }, []);

  return <></>;
};

export default IndexedDbContext;
