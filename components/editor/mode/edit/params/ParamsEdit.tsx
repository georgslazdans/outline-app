import { Dictionary } from "@/app/dictionaries";
import React, { useCallback } from "react";
import GridfinityEdit from "./GridfinityEdit";
import GroupEdit from "./GroupEdit";
import PrimitiveEdit from "./primitive/PrimitiveEdit";
import ShadowEdit from "./ShadowEdit";
import { forModelData } from "@/lib/replicad/model/ModelData";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import GridfinityParams from "@/lib/replicad/model/item/GridfinityParams";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";

type Props = {
  dictionary: Dictionary;
  item: Item;
};

const ParamsEdit = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onGridfinityParamsChange = useCallback(
    (id: string, params: GridfinityParams) => {
      const item = forModelData(modelData).getById(id);
      if (item && item.type == ItemType.Gridfinity) {
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
      case ItemType.Gridfinity:
        return (
          <GridfinityEdit
            dictionary={dictionary}
            params={item.params}
            onParamsChange={(params) =>
              onGridfinityParamsChange(item.id, params)
            }
          ></GridfinityEdit>
        );
      case ItemType.Shadow:
        return (
          <>
            <ShadowEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></ShadowEdit>
          </>
        );
      case ItemType.Primitive:
        return (
          <>
            <PrimitiveEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></PrimitiveEdit>
          </>
        );
      case ItemType.Group:
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
