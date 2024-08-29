import React, { memo, useRef, useState } from "react";
import { Vector3 } from "three";
import ContourIndex from "../../../../../lib/data/contour/ContourIndex";
import { POINT_SCALE_THREEJS, scaleVectorOf } from "@/lib/data/Point";
import pointShaderMaterialOf from "./PointShader";
import { Text } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { usePointClickContext } from "../PointSelection";

type Props = {
  transparent: boolean;
  index: number;
  contourIndex: number;
  color: string;
  size: number;
};

const ContourPoint = memo(function PointMesh({
  contourIndex,
  index,
  color,
  transparent,
  size = 1,
}: Props) {
  const { onPointerDown, onPointerUp } = usePointClickContext();

  const circleRef = useRef<any>();
  const materialRef = useRef<any>();
  const [previousLocation, setPreviousLocation] = useState<Vector3>();

  const asContourIndex = (): ContourIndex => {
    return { contour: contourIndex, point: index };
  };

  const alpha = transparent ? 0 : 0.3;

  const onClickDown = (event: ThreeEvent<PointerEvent>) => {
    setPreviousLocation(event.point);
    onPointerDown(event);
  };

  const onClickUp = (event: ThreeEvent<PointerEvent>) => {
    if (
      previousLocation &&
      previousLocation.distanceTo(event.point) > 0.00001
    ) {
      return;
    }
    onPointerUp(event);
  };
  
  return (
    <group
      position={new Vector3(0, 0, 0.0001)}
      userData={{ contourIndex: asContourIndex() }}
    >
      <mesh
        ref={circleRef}
        scale={scaleVectorOf(POINT_SCALE_THREEJS)}
        userData={{ contourIndex: asContourIndex() }}
        onPointerDown={onClickDown}
        onPointerUp={onClickUp}
      >
        <circleGeometry args={[size]}></circleGeometry>
        <shaderMaterial
          ref={materialRef}
          attach="material"
          {...pointShaderMaterialOf(size, color, alpha)}
        />
      </mesh>
      <Text
        position={new Vector3(0, -0.01 * size * 1.4, 0)}
        scale={scaleVectorOf(POINT_SCALE_THREEJS * size)}
        color={color}
      >
        {index}
      </Text>
    </group>
  );
});

export default ContourPoint;
