"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";
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

  const onItemChange = (item: Item) => {
    setModelData(
      forModelData(modelData).updateById(item.id, item),
      EditorHistoryType.OBJ_UPDATED
    );
  };

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
