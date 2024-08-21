import ReplicadResult from "@/lib/replicad/WorkerResult";
import React, { createContext, ReactNode, useContext, useRef } from "react";

const ModelCacheContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export const ModelCacheProvider = ({ children }: Props) => {
  const cacheRef = useRef(new Map<string, ReplicadResult>());

  const addToCache = (key: string, result: ReplicadResult) => {
    cacheRef.current.set(key, result);
  };

  const getFromCache = (key: string): ReplicadResult | undefined => {
    return cacheRef.current.get(key);
  };

  return (
    <ModelCacheContext.Provider
      value={{
        addToCache,
        getFromCache,
      }}
    >
      {children}
    </ModelCacheContext.Provider>
  );
};

export const useModelCache = (): {
  addToCache: (key: string, result: ReplicadResult) => void;
  getFromCache: (key: string) => ReplicadResult | undefined;
} => {
  const context = useContext(ModelCacheContext);
  if (!context) {
    throw new Error("useModelCache must be used within a ModelCacheProvider");
  }
  return context;
};
