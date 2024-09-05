import ReplicadResult from "@/lib/replicad/WorkerResult";
import React, { createContext, ReactNode, useContext, useRef } from "react";
import newWorkerInstance from "../ReplicadWorker";
import Item, { modelKeyOf, withoutItemData } from "@/lib/replicad/model/Item";
import { useModelLoadingIndicatorContext } from "./ModelLoadingIndicatorContext";

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
  const { isLoading, setIsLoading } = useModelLoadingIndicatorContext();

  const addToCache = (key: string, result: ReplicadResult) => {
    cacheRef.current.set(key, result);
  };

  const getFromCache = (key: string): ReplicadResult | undefined => {
    return cacheRef.current.get(key);
  };

  const removeWorkInstance = (key: string) => {
    if (workInstancesRef.current) {
      const deleted = workInstancesRef.current.delete(key);
      if (deleted && isLoading) {
        if (workInstancesRef.current.size <= 0) {
          setIsLoading(false);
        }
      }
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
      setIsLoading(true);
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

  const getModel = (item: Item): WorkInstance => {
    const key = modelKeyOf(item);
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
