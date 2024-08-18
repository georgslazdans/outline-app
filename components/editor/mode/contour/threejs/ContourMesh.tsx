import { ContourPoints } from "@/lib/Point";
import React, { useCallback } from "react";
import SvgPoint from "./SvgPoint";
import { Matrix4, Vector3 } from "three";
import SvgLines from "./SvgLines";
import { DragControls, Select } from "@react-three/drei";
import ContourIndex from "../ContourIndex";

type Props = {
  contourIndex: number;
  contour: ContourPoints;
  selectedPoint?: ContourIndex;
  onPointMoveStart?: () => void;
  onPointMoveEnd?: () => void;
};

const ContourMesh = ({
  contourIndex,
  contour,
  selectedPoint,
  onPointMoveStart,
  onPointMoveEnd,
}: Props) => {
  const onPointDrag = (pointIndex: number) => {
    return (l: Matrix4) => {
      const pos = new Vector3();
      pos.setFromMatrixPosition(l);
    };
  };

  const isPointSelected = useCallback((pointIndex: number) => {
    console.log("isPointSelected", selectedPoint);
    return (
      selectedPoint?.contour == contourIndex &&
      selectedPoint?.point == pointIndex
    );
  }, [contourIndex, selectedPoint]);

  // TODO create some hook for threejs render stuff
  // Maybe there is a camera already there...
  return (
    <group>
      {contour.points.map((point, index) => {
        return (
          <DragControls
            key={index}
            onDragStart={onPointMoveStart}
            onDragEnd={onPointMoveEnd}
            axisLock="z"
            onDrag={onPointDrag(index)}
          >
            <SvgPoint
              contourIndex={contourIndex}
              index={index}
              position={new Vector3(point.x, point.y, 0)}
              color={isPointSelected(index) ? "red" : "black"}
            />
          </DragControls>
        );
      })}
      <SvgLines contour={contour}></SvgLines>
    </group>
  );
};

export default ContourMesh;
