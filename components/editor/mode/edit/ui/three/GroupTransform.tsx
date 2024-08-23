"use client";

import React from "react";
import TransformControls from "./TransformControls";
import Item from "@/lib/replicad/model/Item";
import { useEditorContext } from "@/components/editor/EditorContext";
import ItemGroup from "@/lib/replicad/model/item/ItemGroup";

type Props = {
  group: Item & ItemGroup;
  parents?: Item[];
  onItemChange: (item: Item) => void;
};

const GroupTransform = ({ group, parents, onItemChange }: Props) => {
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
        parents={parents}
      >
        <></>
      </TransformControls>
    </>
  );
};

export default GroupTransform;
