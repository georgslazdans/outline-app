"use client";

import React, { ReactNode } from "react";
import { useEditorContext } from "../../EditorContext";
import { Select } from "@react-three/drei";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ModelData";
import ItemGroup from "@/lib/replicad/model/item/ItemGroup";

type Props = {
  children: ReactNode;
};

const CanvasSelection = ({ children }: Props) => {
  const { modelData } = useModelDataContext();
  const { selectedId, setSelectedId } = useEditorContext();

  const doesItem = (id: string) => {
    return {
      haveSameParentsAs: (otherId?: string) => {
        if (otherId) {
          const parentId = forModelData(modelData).findParentId(id);
          const previousParentId =
            forModelData(modelData).findParentId(otherId);
          return parentId == previousParentId;
        }
        return false;
      },
      haveNestedSibling: (otherId?: string) => {
        const parentId = forModelData(modelData).findParentId(id);
        if (parentId) {
          if (otherId) {
            const parent = forModelData(modelData).getById(parentId) as ItemGroup;
            const sibling = forModelData({ items: parent.items }).findById(
              otherId
            );
            return !!sibling;
          } else {
            return false;
          }
        } else {
          // Root elements
          return true;
        }
      },
    };
  };

  const itemIdOf = (obj: any): string | undefined => {
    if (obj.length > 0) {
      return obj[0].userData?.id;
    }
  };

  const onSelected = (obj: any) => {
    const itemId = itemIdOf(obj);
    if (itemId) {
      const parentId = forModelData(modelData).findParentId(itemId);
      if (parentId) {
        if (parentId == selectedId) {
          setSelectedId(itemId);
        } else {
          if (
            doesItem(itemId).haveSameParentsAs(selectedId) ||
            doesItem(itemId).haveNestedSibling(selectedId)
          ) {
            setSelectedId(itemId);
          } else {
            setSelectedId(parentId);
          }
        }
      } else {
        setSelectedId(itemId);
      }
    }
  };

  return (
    <Select onChangePointerUp={(obj) => onSelected(obj)}>{children}</Select>
  );
};

export default CanvasSelection;
