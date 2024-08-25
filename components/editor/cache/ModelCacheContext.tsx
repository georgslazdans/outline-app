import ReplicadResult from "@/lib/replicad/WorkerResult";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
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
  const [isModelLoading, setIsModelLoading] = useState(false);

  const addToCache = (key: string, result: ReplicadResult) => {
    cacheRef.current.set(key, result);
  };

  const getFromCache = (key: string): ReplicadResult | undefined => {
    return cacheRef.current.get(key);
  };

  const removeWorkInstance = useCallback(
    (key: string) => {
      if (workInstancesRef.current) {
        workInstancesRef.current.delete(key);
        if (workInstancesRef.current.size <= 0) {
          console.log("Model is not loading!");
          setIsModelLoading(false);
        }
      }
    },
    [setIsModelLoading]
  );

  const getWorker = (key: string): WorkInstance | undefined => {
    if (workInstancesRef.current) {
      return workInstancesRef.current.get(key);
    }
  };

  const addWorkInstance = useCallback(
    (key: string, worker: WorkInstance) => {
      if (workInstancesRef.current) {
        workInstancesRef.current.set(key, worker);
        if (!isModelLoading) {
          console.log("Setting model loading");
          // setIsModelLoading(true);
        }
      }
    },
    [isModelLoading, setIsModelLoading]
  );

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
        isModelLoading,
      }}
    >
      {children}
    </ModelCacheContext.Provider>
  );
};

export const useModelCache = (): {
  getModel: (item: Item) => WorkInstance;
  isModelLoading: boolean;
} => {
  const context = useContext(ModelCacheContext);
  if (!context) {
    throw new Error("useModelCache must be used within a ModelCacheProvider");
  }
  return context;
};
