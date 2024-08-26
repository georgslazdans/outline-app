import React, { memo, useCallback } from "react";
import SvgPoint from "./SvgPoint";
import { Matrix4, Vector3 } from "three";
import SvgLines from "./SvgLines";
import ContourIndex from "../ContourIndex";
import ContourPoints from "@/lib/point/ContourPoints";

type Props = {
  contourIndex: number;
  contour: ContourPoints;
  onContourChange: (contour: ContourPoints) => void;
  selectedPoint?: ContourIndex;
  onPointMoveStart: () => void;
  onPointMoveEnd: () => void;
};

const ContourMesh = memo(function ContourMeshFun({
  contourIndex,
  contour,
  onContourChange,
  selectedPoint,
  onPointMoveStart,
  onPointMoveEnd,
}: Props) {
  const onPointDrag = (pointIndex: number) => {
    return (l: Matrix4, _dl: Matrix4, w: Matrix4, dw: Matrix4) => {
      const pos = new Vector3();
      pos.setFromMatrixPosition(w);

      const delta = new Vector3();
      delta.setFromMatrixPosition(dw);

      const updatedPoints = [...contour.points];
      updatedPoints[pointIndex] = { x: pos.x + delta.x, y: pos.y + delta.y };
      onContourChange({ points: updatedPoints });
    };
  };

  const isPointSelected = useCallback(
    (pointIndex: number) => {
      return (
        selectedPoint?.contour == contourIndex &&
        selectedPoint?.point == pointIndex
      );
    },
    [contourIndex, selectedPoint]
  );

  // TODO onPointMoveStart and onPointMoveEnd is ugly
  // TODO create some hook for threejs render stuff
  // Maybe there is a camera already there...

  return (
    <group>
      {contour.points.map((point, index) => {
        return (
          <SvgPoint
            key={index}
            contourIndex={contourIndex}
            index={index}
            position={new Vector3(point.x, point.y, 0)}
            color={isPointSelected(index) ? "red" : "black"}
            onDragStart={onPointMoveStart}
            onDragEnd={onPointMoveEnd}
            onDrag={onPointDrag(index)}
          />
        );
      })}
      <SvgLines contour={contour}></SvgLines>
    </group>
  );
});

export default ContourMesh;
