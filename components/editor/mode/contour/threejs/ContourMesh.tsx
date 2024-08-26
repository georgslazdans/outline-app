import React, { memo, useCallback, useEffect, useState } from "react";
import PointMesh from "./PointMesh";
import { Matrix4, Vector3 } from "three";
import SvgLines from "./SvgLines";
import ContourIndex from "../ContourIndex";
import ContourPoints from "@/lib/point/ContourPoints";
import Draggable from "./Draggable";
import Point from "@/lib/point/Point";

type Props = {
  contourIndex: number;
  contour: ContourPoints;
  onContourChange: (contour: ContourPoints) => void;
  selectedPoint?: ContourIndex;
};

const ContourMesh = memo(function ContourMeshFun({
  contourIndex,
  contour,
  onContourChange,
  selectedPoint,
}: Props) {
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  useEffect(() => {
    setCurrentPoints(contour.points);
  }, [contour]);

  const onPointDrag = (pointIndex: number) => {
    return (l: Matrix4, _dl: Matrix4, w: Matrix4, dw: Matrix4) => {
      const pos = new Vector3();
      pos.setFromMatrixPosition(w);

      const delta = new Vector3();
      delta.setFromMatrixPosition(dw);

      const updatedPoints = [...currentPoints];
      updatedPoints[pointIndex] = { x: pos.x + delta.x, y: pos.y + delta.y };
      setCurrentPoints(updatedPoints);
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

  return (
    <group>
      {currentPoints?.length > 0 && (
        <>
          {currentPoints.map((point, index) => {
            return (
              <Draggable
                key={index}
                enabled={isPointSelected(index)}
                position={new Vector3(point.x, point.y, 0)}
                onPointDrag={onPointDrag(index)}
              >
                <PointMesh
                  contourIndex={contourIndex}
                  index={index}
                  color={isPointSelected(index) ? "red" : "black"}
                />
              </Draggable>
            );
          })}
          <SvgLines points={currentPoints}></SvgLines>
        </>
      )}
    </group>
  );
});

export default ContourMesh;
