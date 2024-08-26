"use client";

import { Select } from "@react-three/drei";
import React, { ReactNode } from "react";
import { useEditorContext } from "../../EditorContext";
import ContourIndex from "./ContourIndex";

type Props = {
  children: ReactNode;
};

const ContourSelection = ({ children }: Props) => {
  const { setSelectedPoint } = useEditorContext();

  const onSelected = (obj: any) => {
    console.log("Selected", obj);
    if (obj.length > 0) {
      const point = obj[0];
      const pointIndex = point.userData?.contourIndex as ContourIndex;
      if (pointIndex) {
        setSelectedPoint(pointIndex);
      }
    }
  };

  return (
    <>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>{children}</Select>
    </>
  );
};

export default ContourSelection;
