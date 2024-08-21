"use client";

import { useModelContext } from "@/context/ModelContext";
import { ModelData } from "@/lib/replicad/ModelData";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface EditHistoryType {
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  addHistoryEvent(data: ModelData): void;
}

const EditorHistoryContext = createContext<EditHistoryType | undefined>(
  undefined
);

const MAX_ITEMS = 30;

export const EditorHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { model, setModel } = useModelContext();
  const [items, setItems] = useState<ModelData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = () => {
    return currentIndex > 0;
  };
  const canRedo = () => {
    return currentIndex < items.length - 1;
  };

  const undo = () => {
    if (canUndo()) {
      const newIndex = currentIndex - 1;
      const modelData = items[newIndex];
      setModel({ ...model, modelData: modelData });
      setCurrentIndex(newIndex);
    }
  };

  const redo = () => {
    if (canRedo()) {
      const newIndex = currentIndex + 1;
      const modelData = items[newIndex];
      setModel({ ...model, modelData: modelData });
      setCurrentIndex(newIndex);
    }
  };

  // TODO add grouping of similar types
  const addHistoryEvent = (data: ModelData) => {
    // TODO clear previous if current index is not the last
    let newItems = [...items, data];
    if (newItems.length > MAX_ITEMS) {
      newItems = newItems.slice(-MAX_ITEMS);
    }
    setItems(newItems);
    setCurrentIndex(newItems.length - 1);
  };

  return (
    <EditorHistoryContext.Provider
      value={{
        undo,
        redo,
        addHistoryEvent,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </EditorHistoryContext.Provider>
  );
};

export const useEditorHistoryContext = (): EditHistoryType => {
  const context = useContext(EditorHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useEditHistoryContext must be used within an EditorHistoryProvider"
    );
  }
  return context;
};
