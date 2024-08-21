"use client";

import { useModelContext } from "@/context/ModelContext";
import { ModelData } from "@/lib/replicad/ModelData";
import React, { createContext, ReactNode, useContext, useState } from "react";
import EditorHistoryType from "./EditorHistoryType";

type EditHistoryOptions = {
  type: EditorHistoryType;
};

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

type HistoryData = ModelData & {
  options: EditHistoryOptions;
};

const MAX_ITEMS = 30;

export const EditorHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { model, setModel } = useModelContext();
  const [items, setItems] = useState<HistoryData[]>([]);
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
      const modelData = {
        items: items[newIndex].items.map((it) => {
          return { ...it };
        }),
      };
      setModel({ ...model, modelData: modelData });
      setCurrentIndex(newIndex);
    }
  };

  const redo = () => {
    if (canRedo()) {
      const newIndex = currentIndex + 1;
      const modelData = {
        items: items[newIndex].items.map((it) => {
          return { ...it };
        }),
      };
      setModel({ ...model, modelData: modelData });
      setCurrentIndex(newIndex);
    }
  };

  const supportsHistoryCompression = (historyData: HistoryData) => {
    const supportedTypes = [
      EditorHistoryType.TRANSLATION,
      EditorHistoryType.ROTATION,
    ];
    const currentItem = items[currentIndex];
    return (
      supportedTypes.includes(historyData.options.type) &&
      currentItem.options.type == historyData.options.type
    );
  };

  const addHistoryEvent = (data: ModelData, options: EditHistoryOptions) => {
    const historyItems = data.items.map((it) => {
      return { ...it };
    });
    const historyData = { items: historyItems, options };

    let newItems: HistoryData[] = [];
    if (supportsHistoryCompression(historyData)) {
      newItems = [...items.slice(0, currentIndex), historyData];
    } else {
      newItems = [...items.slice(0, currentIndex + 1), historyData];
    }
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
