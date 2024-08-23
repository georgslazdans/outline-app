"use client";

import { Dictionary } from "@/app/dictionaries";
import ModelData, {
  forModelData,
} from "@/lib/replicad/ModelData";
import React, {  } from "react";
import { Select } from "@react-three/drei";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import { useEditorContext } from "../../EditorContext";
import { UpdateModelData } from "../../EditorComponent";
import EditItemList from "./EditItemList";
import EditorHistoryType from "../../history/EditorHistoryType";
import Item from "@/lib/replicad/Item";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

export type ItemModel = {
  [id: string]: ReplicadResult;
};

const EditCanvas = ({ dictionary, modelData, setModelData }: Props) => {
  const { setSelectedId } = useEditorContext();

  // const onWorkerResult = (id: string, result: ReplicadResult) => {
  //   const updatedModels = { ...itemModels };
  //   updatedModels[id] = result;
  //   setItemModels(updatedModels);
  // };

  const onSelected = (obj: any) => {
    if (obj.length > 0) {
      const id = obj[0].userData?.id;
      if (id) {
        setSelectedId(id);
      }
    }
  };

  // useEffect(() => {
  //   const modelDataKeys = ungroupedItemsOf(modelData.items).map((it) => it.id);
  //   const existingKeys = Object.keys(itemModels);
  //   const keysToDelete = existingKeys.filter(
  //     (key) => !modelDataKeys.includes(key)
  //   );

  //   if (keysToDelete && keysToDelete.length > 0) {
  //     let updatedModels = { ...itemModels };
  //     keysToDelete.forEach((key) => {
  //       delete updatedModels[key];
  //     });
  //     setItemModels(updatedModels);
  //   }
  // }, [modelData, itemModels]);

  const onItemChange = (item: Item) => {
    setModelData(
      forModelData(modelData).updateById(item.id, item),
      EditorHistoryType.OBJ_UPDATED
    );
  };

  return (
    <>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>
        <EditItemList
          dictionary={dictionary}
          items={modelData.items}
          onItemChange={onItemChange}
        ></EditItemList>
      </Select>
    </>
  );
};

export default EditCanvas;
