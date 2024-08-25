"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React, { useCallback } from "react";
import CanvasItemList from "./CanvasItemList";
import EditorHistoryType from "../../history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import { useModelDataContext } from "../../ModelDataContext";
import CanvasSelection from "./CanvasSelection";

type Props = {
  dictionary: Dictionary;
};

const EditCanvas = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onItemChange = useCallback((item: Item) => {
    setModelData(
      forModelData(modelData).updateItem(item),
      EditorHistoryType.OBJ_UPDATED
    );
  }, [modelData, setModelData]);

  return (
    <>
      <CanvasSelection>
        <CanvasItemList
          dictionary={dictionary}
          items={modelData.items}
          onItemChange={onItemChange}
        ></CanvasItemList>
      </CanvasSelection>
    </>
  );
};

export default EditCanvas;
