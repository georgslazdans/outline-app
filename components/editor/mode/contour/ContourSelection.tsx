"use client";

import { Select } from "@react-three/drei";
import React, { ReactNode } from "react";
import { useEditorContext } from "../../EditorContext";
import ContourIndex from "../../../../lib/data/contour/ContourIndex";

type Props = {
  children: ReactNode;
};

const ContourSelection = ({ children }: Props) => {
  const { setSelectedPoint } = useEditorContext();

  const onSelected = (obj: any) => {
    if (obj.length > 0) {
      const point = obj[0];
      const pointIndex = point.userData?.contourIndex as ContourIndex;
      console.log("Selected", pointIndex, obj);

      if (pointIndex) {
        setSelectedPoint(pointIndex);
      }
    }
  };

  return (
    <>
      <Select multiple onChangePointerUp={(obj) => onSelected(obj)}>
        {children}
      </Select>
    </>
  );
};

export default ContourSelection;
