import { Sphere } from "@react-three/drei";
import React, { memo, useRef } from "react";
import { Vector3 } from "three";
import ContourIndex from "../ContourIndex";

type Props = {
  index: number;
  contourIndex: number;
  position: Vector3;
  color: "red" | "black";
};

const SvgPoint = memo(function PointMesh({
  contourIndex,
  index,
  position,
  color,
}: Props) {
  const pointRef = useRef<any>();

  const asContourIndex = (): ContourIndex => {
    return { contour: contourIndex, point: index };
  };

  const pointSize = 0.01;
  return (
    <Sphere
      position={position}
      ref={pointRef}
      scale={[pointSize, pointSize, pointSize]}
      userData={{ contourIndex: asContourIndex() }}
    >
      <meshBasicMaterial color={color} />
    </Sphere>
  );
});

export default SvgPoint;
