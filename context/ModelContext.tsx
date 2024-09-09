"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Model from "@/lib/Model";
import { defaultGridfinityParams } from "@/lib/replicad/model/item/GridfinityParams";
import { gridfinityItemOf } from "@/lib/replicad/model/item/Gridfinity";
import { useIndexedDB } from "react-indexed-db-hook";
type ModelContextType = {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const { update } = useIndexedDB("models");

  const defaultModel = {
    name: "Untitled",
    modelData: { items: [gridfinityItemOf(defaultGridfinityParams())] },
    addDate: new Date(),
  };
  const [model, setModelContext] = useState<Model>(defaultModel);
  const modelRef = useRef<Model>(model);

  const doAutosave = useCallback(() => {
    if (modelRef.current.id) {
      update(modelRef.current).then(
        () => {
          console.log("Model saved!", modelRef.current.id);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [update]);

  const createAutosaveTimeout = useCallback(() => {
    setTimeout(() => {
      doAutosave();
      createAutosaveTimeout();
    }, 1000 * 30);
  }, [doAutosave]);

  useEffect(() => {
    createAutosaveTimeout();
  }, [createAutosaveTimeout]);

  const setModel = (newModel: Model | ((model: Model) => Model)) => {
    let data: Model;
    if (typeof newModel === "function") {
      data = newModel(model);
    } else {
      data = newModel;
    }
    setModelContext(data);
    modelRef.current = data;
  };

  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
