"use client";

import { useModelContext } from "@/context/ModelContext";
import ModelData from "@/lib/replicad/ModelData";
import React, { createContext, ReactNode, useContext, useState } from "react";
import HistoryData, {
  historyDataOf,
  supportsHistoryCompression,
} from "./HistoryData";
import EditHistoryOptions from "./EditHistoryOptions";
import { ensureMaxSize } from "@/lib/utils/Arrays";
import { useEditorContext } from "../EditorContext";

interface EditHistoryType {
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  addHistoryEvent(data: ModelData, options: EditHistoryOptions): void;
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
  const { setSelectedId, setSelectedPoint } = useEditorContext();
  const { model, setModel } = useModelContext();
  const [items, setItems] = useState<HistoryData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = () => {
    return currentIndex > 0;
  };
  const canRedo = () => {
    return currentIndex < items.length - 1;
  };

  const setUpState = (index: number) => {
    const historyData = items[index];
    const modelData = {
      items: historyData.items.map((it) => {
        return { ...it };
      }),
    };
    setModel({ ...model, modelData: modelData });
    setCurrentIndex(index);
    if (historyData.options.selectedId) {
      setSelectedId(historyData.options.selectedId);
    }
    if (historyData.options.selectedPoint) {
      setSelectedPoint(historyData.options.selectedPoint);
    }
  };

  const undo = () => {
    if (canUndo()) {
      const newIndex = currentIndex - 1;
      setUpState(newIndex);
    }
  };

  const redo = () => {
    if (canRedo()) {
      const newIndex = currentIndex + 1;
      setUpState(newIndex);
    }
  };

  const addHistoryEvent = (data: ModelData, options: EditHistoryOptions) => {
    const newHistoryData = historyDataOf(data, options);
    let sliceIndex = currentIndex + 1;
    const currentItem = items[currentIndex];
    if (supportsHistoryCompression(newHistoryData, currentItem)) {
      sliceIndex = currentIndex;
    }
    const newItems = [...items.slice(0, sliceIndex), newHistoryData];

    setItems(ensureMaxSize(newItems, MAX_ITEMS));
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
