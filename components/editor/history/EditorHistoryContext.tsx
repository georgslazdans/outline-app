"use client";

import { useModelContext } from "@/context/ModelContext";
import ModelData from "@/lib/replicad/model/ModelData";
import React, { createContext, ReactNode, useContext, useState } from "react";
import HistoryData, {
  historyDataOf,
  supportsHistoryCompression,
} from "./HistoryData";
import EditHistoryOptions from "./EditHistoryOptions";
import { ensureMaxSize } from "@/lib/utils/Arrays";
import { useEditorContext } from "../EditorContext";
import EditorMode from "../mode/EditorMode";
import EditorHistoryType from "./EditorHistoryType";

interface EditHistoryType {
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  addHistoryEvent(data: ModelData, options: EditHistoryOptions): void;
  compressHistoryEvents(type: EditorHistoryType): void;
  ensureLastEventHas(selectedId: string, type: EditorHistoryType): void;
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
  const { selectedId, setSelectedId, setSelectedPoint, editorMode } =
    useEditorContext();
  const { model, setModel } = useModelContext();
  const [items, setItems] = useState<HistoryData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasSameSelectedId = (data: HistoryData) => {
    return data.options.selectedId == selectedId;
  };

  const canUndo = () => {
    if (editorMode == EditorMode.RESULT) return false;
    const hasItems = currentIndex > 0;
    if (hasItems && editorMode == EditorMode.CONTOUR_EDIT) {
      const potentialItem = items[currentIndex - 1];
      return hasSameSelectedId(potentialItem);
    }
    return hasItems;
  };
  const canRedo = () => {
    if (editorMode == EditorMode.RESULT) return false;
    const hasItems = currentIndex < items.length - 1;
    if (hasItems && editorMode == EditorMode.CONTOUR_EDIT) {
      const potentialItem = items[currentIndex + 1];
      return hasSameSelectedId(potentialItem);
    }
    return hasItems;
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
    const newItems = ensureMaxSize(
      [...items.slice(0, sliceIndex), newHistoryData],
      MAX_ITEMS
    );

    setItems(newItems);
    setCurrentIndex(newItems.length - 1);
  };

  const ensureLastEventHas = (selectedId: string, type: EditorHistoryType) => {
    const currentItem = items[currentIndex];
    if (currentItem.options.selectedId == selectedId) {
      return;
    } else {
      const newItems = [
        ...items,
        {
          ...currentItem,
          options: {
            ...currentItem.options,
            selectedId: selectedId,
            addDate: new Date(),
            type: type,
          },
        },
      ];
      setItems(ensureMaxSize(newItems, MAX_ITEMS));
      setCurrentIndex(newItems.length - 1);
    }
  };

  const compressHistoryEvents = (type: EditorHistoryType) => {
    const hasTheSameType = (data: HistoryData) => {
      if (!data) {
        debugger;
      }
      return data.options.type == type;
    };

    const currentItem = items[currentIndex];
    if (hasTheSameType(currentItem)) {
      const compressItems = () => {
        const hasSameItemId = (data: HistoryData) =>
          data.options.itemId == currentItem.options.itemId;
        let compressedItems = [currentItem];
        let canCompress = true;
        for (const item of items.toReversed()) {
          if (!hasTheSameType(item) || !hasSameItemId(item)) {
            canCompress = false;
          }
          if (!canCompress) {
            compressedItems.push(item);
          }
        }
        return compressedItems.reverse();
      };
      const compressedItems = compressItems();
      setItems(compressedItems);
      setCurrentIndex(compressedItems.length - 1);
    }
  };

  return (
    <EditorHistoryContext.Provider
      value={{
        undo,
        redo,
        addHistoryEvent,
        canUndo,
        canRedo,
        compressHistoryEvents,
        ensureLastEventHas,
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
