import { ContourPoints } from "@/lib/Point";
import React from "react";
import SvgPoint from "./SvgPoint";
import { Vector3 } from "three";
import SvgLines from "./SvgLines";
import { DragControls } from "@react-three/drei";

type Props = {
  contoursPoints: ContourPoints[];
  onPointMoveStart?: () => void;
  onPointMoveEnd?: () => void;
};

const SvgMesh = ({
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

  return (
    <group>
    {/* // <group scale={new Vector3(1, -1, 1)}> */}
      {contoursPoints.map((points, index) => {
        const svgPoints = points.points.map((point, index1) => {
          return (
            <DragControls
              key={"x" + index + "y" + index1}
              onDragStart={onPointMoveStart}
              onDragEnd={onPointMoveEnd}
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
            <SvgLines key={index} contour={points}></SvgLines>
          </>
        );
      })}
    </group>
  );
};

export default SvgMesh;
