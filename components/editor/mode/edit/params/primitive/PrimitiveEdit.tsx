"use client";

import { Dictionary } from "@/app/dictionaries";
import SelectField from "@/components/fields/SelectField";
import React, { ChangeEvent, useCallback } from "react";
import SphereEdit from "./SphereEdit";
import PrimitiveParams, {
  BoxParams,
  CapsuleParams,
  CylinderParams,
  defaultParamsFor,
  defaultPrimitiveHeightOf,
  defaultRotationOf,
  SphereParams,
} from "@/lib/replicad/model/item/PrimitiveParams";
import BoxEdit from "./BoxEdit";
import CylinderEdit from "./CylinderEdit";
import TransformEdit from "../TransformEdit";
import Item from "@/lib/replicad/model/Item";
import BooleanOperationEdit from "../BooleanOperationEdit";
import Primitive from "@/lib/replicad/model/item/Primitive";
import PrimitiveType, {
  primitiveTypeOptionsFor,
} from "@/lib/replicad/model/item/PrimitiveType";
import CapsuleEdit from "./CapsuleEdit";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import ModelData from "@/lib/replicad/model/ModelData";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";

type Props = {
  dictionary: Dictionary;
  item: Item & Primitive;
};

const gridfinityAlignmentHeight = (data: ModelData, item: Item & Primitive) => {
  const { parentTotalHeight } = forModelData(data);
  const gridfinityHeight = gridfinityHeightOf(data);
  return (
    gridfinityHeight +
    defaultPrimitiveHeightOf(item.params) -
    parentTotalHeight(item.id)
  );
};

const HEIGHT_CHANGE_TYPES = [PrimitiveType.BOX, PrimitiveType.CYLINDER];
const boxOrCylinderHeightChanged = (
  oldItem: Item & Primitive,
  newItem: Item & Primitive
): boolean => {
  if (
    oldItem.params.type == newItem.params.type &&
    HEIGHT_CHANGE_TYPES.includes(oldItem.params.type)
  ) {
    const oldParams = oldItem.params as CylinderParams | BoxParams;
    const newParams = newItem.params as CylinderParams | BoxParams;
    return oldParams.height != newParams.height;
  }
  return false;
};

const updateAlignment = (
  data: ModelData,
  oldItem: Item & Primitive,
  newItem: Item & Primitive
): Item => {
  if (
    (oldItem.params.type != newItem.params.type ||
      boxOrCylinderHeightChanged(oldItem, newItem)) &&
    gridfinityAlignmentHeight(data, oldItem) == oldItem.translation?.z
  ) {
    return {
      ...newItem,
      translation: {
        ...newItem.translation!,
        z: gridfinityAlignmentHeight(data, newItem),
      },
    };
  } else {
    return newItem;
  }
};

const PrimitiveEdit = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onItemChange = useCallback(
    (newItem: Item) => {
      const updatedData = forModelData(modelData).updateItem(
        updateAlignment(modelData, item, newItem as Item & Primitive)
      );
      setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, item.id);
    },
    [item, modelData, setModelData]
  );

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (item.params.type != value) {
      const updatedParams = defaultParamsFor(value as PrimitiveType);
      const updatedItem = {
        ...item,
        params: updatedParams,
        rotation: defaultRotationOf(value as PrimitiveType),
      };
      onItemChange(updatedItem);
    }
  };

  const handleParamsChange = (params: PrimitiveParams) => {
    const updatedItem = { ...item, params: params };
    onItemChange(updatedItem);
  };

  const isCurrentType = (type: PrimitiveType) => {
    return item.params.type == type;
  };

  return (
    <>
      <BooleanOperationEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></BooleanOperationEdit>
      <SelectField
        label="Primitive Type"
        name={"primitive-type"}
        options={primitiveTypeOptionsFor(dictionary)}
        value={item.params.type}
        onChange={handleTypeChange}
      ></SelectField>
      {isCurrentType(PrimitiveType.SPHERE) && (
        <SphereEdit
          dictionary={dictionary}
          sphereParams={item.params as SphereParams}
          onParamsChange={handleParamsChange}
        ></SphereEdit>
      )}
      {isCurrentType(PrimitiveType.BOX) && (
        <BoxEdit
          dictionary={dictionary}
          boxParams={item.params as BoxParams}
          onParamsChange={handleParamsChange}
        ></BoxEdit>
      )}
      {isCurrentType(PrimitiveType.CYLINDER) && (
        <CylinderEdit
          dictionary={dictionary}
          cylinderParams={item.params as CylinderParams}
          onParamsChange={handleParamsChange}
        ></CylinderEdit>
      )}
      {isCurrentType(PrimitiveType.CAPSULE) && (
        <CapsuleEdit
          dictionary={dictionary}
          capsuleParams={item.params as CapsuleParams}
          onParamsChange={handleParamsChange}
        ></CapsuleEdit>
      )}

      <TransformEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></TransformEdit>
    </>
  );
};

export default PrimitiveEdit;
