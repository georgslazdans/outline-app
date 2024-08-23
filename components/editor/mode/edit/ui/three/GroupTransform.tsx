"use client";

import { ItemGroup } from "@/lib/replicad/ModelType";
import React from "react";
import TransformControls from "./TransformControls";
import Item from "@/lib/replicad/Item";
import { useEditorContext } from "@/components/editor/EditorContext";

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
