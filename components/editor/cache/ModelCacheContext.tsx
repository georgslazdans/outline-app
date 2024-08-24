import ReplicadResult from "@/lib/replicad/WorkerResult";
import React, { createContext, ReactNode, useContext, useRef } from "react";
import newWorkerInstance from "../replicad/ReplicadWorker";
import Item, { withoutItemData } from "@/lib/replicad/model/Item";

const ModelCacheContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

type WorkInstance = {
  promise: Promise<ReplicadResult>;
  cancel: () => void;
};

export const ModelCacheProvider = ({ children }: Props) => {
  const cacheRef = useRef(new Map<string, ReplicadResult>());
  const workInstancesRef = useRef<Map<string, WorkInstance>>(new Map());

  const addToCache = (key: string, result: ReplicadResult) => {
    cacheRef.current.set(key, result);
  };

  const getFromCache = (key: string): ReplicadResult | undefined => {
    return cacheRef.current.get(key);
  };

  const removeWorkInstance = (key: string) => {
    if (workInstancesRef.current) {
      workInstancesRef.current.delete(key);
    }
  };

  const getWorker = (key: string): WorkInstance | undefined => {
    if (workInstancesRef.current) {
      return workInstancesRef.current.get(key);
    }
  };

  const addWorkInstance = (key: string, worker: WorkInstance) => {
    if (workInstancesRef.current) {
      workInstancesRef.current.set(key, worker);
    }
  };

  const executeWork = (item: Item, key: string): WorkInstance => {
    const { api, worker } = newWorkerInstance();

    const cancel = () => {
      removeWorkInstance(key);
      worker.terminate();
    };

    const promise = api.processItem(item).then((result) => {
      addToCache(key, result);
      cancel();
      return result;
    });

    const instance = { promise, cancel };
    addWorkInstance(key, instance);
    return instance;
  };

  const keyOf = (item: Item) => JSON.stringify(withoutItemData(item));

  const getModel = (item: Item): WorkInstance => {
    const key = keyOf(item);
    const cacheEntry = getFromCache(key);
    if (cacheEntry) {
      return {
        promise: new Promise((resolve) => resolve(cacheEntry)),
        cancel: () => {},
      };
    } else {
      const worker = getWorker(key);
      if (worker) {
        return worker;
      }
      return executeWork(item, key);
    }
  };

  return (
    <ModelCacheContext.Provider
      value={{
        getModel,
      }}
    >
      {children}
    </ModelCacheContext.Provider>
  );
};

export const useModelCache = (): {
  getModel: (item: Item) => WorkInstance;
} => {
  const context = useContext(ModelCacheContext);
  if (!context) {
    throw new Error("useModelCache must be used within a ModelCacheProvider");
  }
  return context;
};
