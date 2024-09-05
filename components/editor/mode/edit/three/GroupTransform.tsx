"use client";

import React, { ReactNode } from "react";
import TransformControls from "./TransformControls";
import Item from "@/lib/replicad/model/Item";
import { useEditorContext } from "@/components/editor/EditorContext";
import ItemGroup from "@/lib/replicad/model/item/ItemGroup";

type Props = {
  group: Item & ItemGroup;
  onItemChange: (item: Item) => void;
  children?: ReactNode;
};

const GroupTransform = ({ group, onItemChange, children }: Props) => {
  const { selectedId } = useEditorContext();

  const isSelected = () => {
    return group.id == selectedId;
  };

  return (
    <>
      <TransformControls
        item={group}
        enableGizmo={isSelected()}
        onItemChange={onItemChange}
      >
        {children}
      </TransformControls>
    </>
  );
};

export default GroupTransform;
