import { Dictionary } from "@/app/dictionaries";
import React, { useCallback } from "react";
import GridfinityEdit from "./GridfinityEdit";
import GroupEdit from "./GroupEdit";
import PrimitiveEdit from "./primitive/PrimitiveEdit";
import ShadowEdit from "./ShadowEdit";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import ModelData, { forModelData } from "@/lib/replicad/ModelData";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import GridfinityParams from "@/lib/replicad/params/GridfinityParams";
import Item from "@/lib/replicad/Item";
import ModelType from "@/lib/replicad/ModelType";

type Props = {
  dictionary: Dictionary;
  item: Item;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const ParamsEdit = ({ dictionary, item, modelData, setModelData }: Props) => {
  const onGridfinityParamsChange = useCallback(
    (id: string, params: GridfinityParams) => {
      const item = forModelData(modelData).getById(id);
      if (item && item.type == ModelType.Gridfinity) {
        const updatedData = forModelData(modelData).updateById(id, {
          ...item,
          params: params,
        });
        setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, id);
      } else {
        throw new Error("Item not found! Id: " + id);
      }
    },
    [modelData, setModelData]
  );

  const onItemChanged = useCallback(
    (id: string, params: Item) => {
      const updatedData = forModelData(modelData).updateById(id, params);
      setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, id);
    },
    [modelData, setModelData]
  );

  const propertiesComponentFor = () => {
    switch (item.type) {
      case ModelType.Gridfinity:
        return (
          <GridfinityEdit
            dictionary={dictionary}
            params={item.params}
            onParamsChange={(params) =>
              onGridfinityParamsChange(item.id, params)
            }
          ></GridfinityEdit>
        );
      case ModelType.Shadow:
        return (
          <>
            <ShadowEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></ShadowEdit>
          </>
        );
      case ModelType.Primitive:
        return (
          <>
            <PrimitiveEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></PrimitiveEdit>
          </>
        );
      case ModelType.Group:
        return (
          <>
            <GroupEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></GroupEdit>
          </>
        );
    }
  };

  return <>{propertiesComponentFor()}</>;
};

export default ParamsEdit;
