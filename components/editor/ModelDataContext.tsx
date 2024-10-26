import React, { createContext, useContext, ReactNode, useEffect } from "react";
import ModelData from "@/lib/replicad/model/ModelData";
import EditorHistoryType from "./history/EditorHistoryType";
import { useEditorHistoryContext } from "./history/EditorHistoryContext";
import { useModelContext } from "@/components/editor/ModelContext";
import { useEditorContext } from "./EditorContext";

export type SetModelDataType = (
  modelData: ModelData,
  type: EditorHistoryType,
  id?: string
) => void;

type ModelDataContextType = {
  modelData: ModelData;
  setModelData: SetModelDataType;
};

const ModelDataContext = createContext<ModelDataContextType | undefined>(
  undefined
);

export const ModelDataProvider = ({ children }: { children: ReactNode }) => {
  const { model, setModel } = useModelContext();
  const { selectedId, selectedPoint } = useEditorContext();
  const { addHistoryEvent } = useEditorHistoryContext();

  useEffect(() => {
    addHistoryEvent(model.modelData, {
      type: EditorHistoryType.INITIAL,
      addDate: new Date(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setModelData: SetModelDataType = (
    modelData: ModelData,
    type: EditorHistoryType,
    id?: string
  ) => {
    addHistoryEvent(modelData, {
      type: type,
      itemId: id,
      addDate: new Date(),
      selectedId: selectedId,
      selectedPoint: selectedPoint,
    });
    setModel((prev) => {
      return { ...prev, modelData: modelData };
    });
  };

  return (
    <ModelDataContext.Provider
      value={{
        modelData: model.modelData,
        setModelData: setModelData,
      }}
    >
      {children}
    </ModelDataContext.Provider>
  );
};

export const useModelDataContext = (): ModelDataContextType => {
  const context = useContext(ModelDataContext);
  if (context === undefined) {
    throw new Error("useModelDataContext must be used within an ModelDataProvider");
  }
  return context;
};
