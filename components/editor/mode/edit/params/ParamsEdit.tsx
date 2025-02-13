import { Dictionary } from "@/app/dictionaries";
import React, { useCallback } from "react";
import GridfinityEdit from "./gridfinity/GridfinityEdit";
import GroupEdit from "./GroupEdit";
import PrimitiveEdit from "./primitive/PrimitiveEdit";
import ContourEdit from "./ShadowEdit";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import TextItemEdit from "./TextItemEdit";
import SplitGridfinityBoxEdit from "./gridfinity/SplitGridfinityBoxEdit";

type Props = {
  dictionary: Dictionary;
  item: Item;
};

const ParamsEdit = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onItemChanged = useCallback(
    (id: string, params: Item) => {
      const updatedData = forModelData(modelData).updateItem(params);
      setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, id);
    },
    [modelData, setModelData]
  );

  const propertiesComponentFor = () => {
    switch (item.type) {
      case ItemType.Gridfinity:
        return (
          <GridfinityEdit dictionary={dictionary} item={item}></GridfinityEdit>
        );
      case ItemType.Contour:
        return (
          <>
            <ContourEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></ContourEdit>
          </>
        );
      case ItemType.Primitive:
        return (
          <>
            <PrimitiveEdit dictionary={dictionary} item={item}></PrimitiveEdit>
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
      case ItemType.Text:
        return (
          <>
            <TextItemEdit
              dictionary={dictionary}
              item={item}
              onItemChange={(params) => onItemChanged(item.id, params)}
            ></TextItemEdit>
          </>
        );
      case ItemType.GridfinitySplit:
        return (
          <SplitGridfinityBoxEdit
            item={item}
            onItemChange={(params) => onItemChanged(item.id, params)}
          ></SplitGridfinityBoxEdit>
        );
    }
  };

  return <>{propertiesComponentFor()}</>;
};

export default ParamsEdit;
