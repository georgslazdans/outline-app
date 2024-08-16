import { ContourPoints } from "@/lib/Point";
import React from "react";
import SvgPoint from "./SvgPoint";
import { Vector3 } from "three";
import SvgLines from "./SvgLines";
import { DragControls, Select } from "@react-three/drei";

type Props = {
  contoursPoints: ContourPoints[];
  onPointMoveStart?: () => void;
  onPointMoveEnd?: () => void;
  onPointSelect?: () => void;
};

const ContourMesh = ({
  contoursPoints,
  onPointMoveStart,
  onPointMoveEnd,
}: Props) => {
  const handlePointDrag = (index: number) => (newPosition: Vector3) => {
    // setPoints((points) => {
    //   const newPoints = [...points];
    //   newPoints[index] = newPosition;
    //   return newPoints;
    // });
  };
  const scale = 0.01;

  const scaledPoints = contoursPoints.map((it) => {
    return {
      points: it.points.map((point) => {
        return {
          x: point.x * scale,
          y: point.y * scale,
        };
      }),
    };
  });

  const onSelected = (obj: any) => {
    if (obj.length > 0) {
      console.log("Selected", obj);
    }
  };
  
  return (
    // <group>
    <group>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>
        {scaledPoints.map((points, index) => {
          const svgPoints = points.points.map((point, index1) => {
            return (
              <DragControls
                key={"x" + index + "y" + index1}
                onDragStart={onPointMoveStart}
                onDragEnd={onPointMoveEnd}
                axisLock="z"
              >
                <SvgPoint
                  key={"x" + index + "y" + index1}
                  position={new Vector3(point.x, point.y, 0)}
                  onDrag={handlePointDrag(index)}
                />
              </DragControls>
            );
          });
          return (
            <>
              {svgPoints}
              <SvgLines key={"line" + index} contour={points}></SvgLines>
            </>
          );
        })}
      </Select>
    </group>
  );
};

export default ContourMesh;
