"use client";

import { Instances } from "@react-three/drei";
import React, { useCallback } from "react";
import ContourPoint from "./ContourPoint";
import Draggable from "./Draggable";
import libPoint from "@/lib/data/Point";
import { useEditorContext } from "@/components/editor/EditorContext";
import pointShaderMaterialOf from "./PointShader";

type Props = {
  points: libPoint[];
  contourIndex: number;
  onPointDrag: (point: libPoint, index: number) => void;
  onModelEditEnd?: () => void;
  pointSize: number;
};

const ContourPointsInstances = ({
  points,
  contourIndex,
  onPointDrag,
  onModelEditEnd,
  pointSize,
}: Props) => {
  const { selectedPoint } = useEditorContext();

  const isPointSelected = useCallback(
    (pointIndex: number) => {
      return (
        selectedPoint?.contour == contourIndex &&
        selectedPoint?.point == pointIndex
      );
    },
    [contourIndex, selectedPoint]
  );

  return (
    <>
      <Instances limit={5000} frustumCulled={false}>
        <circleGeometry args={[1]}></circleGeometry>
        <shaderMaterial
          attach="material"
          {...pointShaderMaterialOf(pointSize)}
        />
        {points.map((point, index) => {
          return (
            <Draggable
              key={index}
              enabled={isPointSelected(index)}
              position={point}
              onPointDrag={(point) => onPointDrag(point, index)}
              onPointDragEnd={onModelEditEnd}
            >
              <ContourPoint
                contourIndex={contourIndex}
                index={index}
                color={isPointSelected(index) ? "#DA4167" : "#2c7d94"} //"#0D0D0E"}
                size={pointSize}
              />
            </Draggable>
          );
        })}
      </Instances>
    </>
  );
};

export default ContourPointsInstances;
