import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import newWorkerInstance, { WorkerApi } from "../../ReplicadWorker";
import { Remote } from "comlink";

type ResultContextType = {
  api: WorkerApi | undefined;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [instance, setInstance] = useState<{
    api: Remote<WorkerApi>;
    worker: Worker;
  }>();

  useEffect(() => {
    const workerInstance = newWorkerInstance();
    setInstance(workerInstance);
    return () => {
      workerInstance.worker.terminate();
    };
  }, []);

  return (
    <ResultContext.Provider
      value={{
        api: instance?.api,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = (): ResultContextType => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error(
      "useResultContext must be used within an ResultContextProvider"
    );
  }
  return context;
};
