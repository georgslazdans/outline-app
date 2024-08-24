"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";
import { Select } from "@react-three/drei";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import { useEditorContext } from "../../EditorContext";
import CanvasItemList from "./CanvasItemList";
import EditorHistoryType from "../../history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import { useModelDataContext } from "../../ModelDataContext";

type Props = {
  dictionary: Dictionary;
};

export type ItemModel = {
  [id: string]: ReplicadResult;
};

const EditCanvas = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { setSelectedId } = useEditorContext();

  // TODO select
  // group by default
  // if group is selected, then selected the object
  const onSelected = (obj: any) => {
    if (obj.length > 0) {
      const id = obj[0].userData?.id;
      if (id) {
        setSelectedId(id);
      }
    }
  };

  const onItemChange = (item: Item) => {
    setModelData(
      forModelData(modelData).updateById(item.id, item),
      EditorHistoryType.OBJ_UPDATED
    );
  };

  return (
    <>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>
        <CanvasItemList
          dictionary={dictionary}
          items={modelData.items}
          onItemChange={onItemChange}
        ></CanvasItemList>
      </Select>
    </>
  );
};

export default EditCanvas;
