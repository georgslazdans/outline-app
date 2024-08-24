"use client";

import React, { ReactNode } from "react";
import { useEditorContext } from "../../EditorContext";
import { Select } from "@react-three/drei";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/queries/ForModelData";

type Props = {
  children: ReactNode;
};

const CanvasSelection = ({ children }: Props) => {
  const { modelData } = useModelDataContext();
  const {
    selectedId,
    setSelectedId,
    transformEditFocused,
    setTransformEditFocused,
  } = useEditorContext();

  const itemIdOf = (obj: any): string | undefined => {
    if (obj.length > 0) {
      return obj[0].userData?.id;
    }
  };

  const onSelected = (obj: any) => {
    if (transformEditFocused) {
      setTransformEditFocused(false);
      return;
    }
    const doesItem = forModelData(modelData).doesItem;
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
