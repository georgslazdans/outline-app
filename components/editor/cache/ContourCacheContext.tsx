"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { Context } from "@/context/DetailsContext";

type ContourCacheContextType = {
  items: Context[];
};

const ContourCacheContext = createContext<ContourCacheContextType | undefined>(
  undefined
);

export const ContourCacheProvider = ({ children }: { children: ReactNode }) => {
  const { getAll } = useIndexedDB("details");
  const [items, setItems] = useState<Context[]>([]);

  useEffect(() => {
    getAll().then((allContexts: Context[]) => {
      if (allContexts && allContexts.length > 0) {
        setItems(allContexts);
      }
    });
  }, []);

  return (
    <ContourCacheContext.Provider
      value={{
        items,
      }}
    >
      {children}
    </ContourCacheContext.Provider>
  );
};

export const useContourCacheContext = (): ContourCacheContextType => {
  const context = useContext(ContourCacheContext);
  if (context === undefined) {
    throw new Error(
      "useContourCacheContext must be used within an ContourCacheProvider"
    );
  }
  return context;
};
