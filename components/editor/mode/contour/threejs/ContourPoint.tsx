import React, { memo, useMemo, useRef, useState } from "react";
import { Color, Vector3 } from "three";
import ContourIndex from "../../../../../lib/data/contour/ContourIndex";
import { POINT_SCALE_THREEJS, scaleVectorOf } from "@/lib/data/Point";
import { Instance, Text } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { usePointClickContext } from "../selection/PointClickContext";

type Props = {
  index: number;
  contourIndex: number;
  color: string;
  size: number;
};

const pointOffset = new Vector3(0, 0, 0.0001);
const scaleVector = scaleVectorOf(POINT_SCALE_THREEJS);

const ContourPoint = memo(function PointMesh({
  contourIndex,
  index,
  color,
  size,
}: Props) {
  const { invalidate } = useThree();
  const { onPointerDown, onPointerUp } = usePointClickContext();

  const circleRef = useRef<any>();
  const [previousLocation, setPreviousLocation] = useState<Vector3>();

  const asContourIndex = (): ContourIndex => {
    return { contour: contourIndex, point: index };
  };

  const textPosition = useMemo(
    () => new Vector3(0, -0.01 * size * 1.4, 0),
    [size]
  );

  const onClickDown = (event: ThreeEvent<PointerEvent>) => {
    setPreviousLocation(event.point);
    onPointerDown(event);
    invalidate();
  };

  const onClickUp = (event: ThreeEvent<PointerEvent>) => {
    if (
      previousLocation &&
      previousLocation.distanceTo(event.point) > 0.00001
    ) {
      return;
    }
    onPointerUp(event);
    invalidate();
  };

  const resultColor = useMemo(() => {
    return new Color(color);
  }, [color]);

  return (
    <group position={pointOffset} userData={{ contourIndex: asContourIndex() }}>
      <Instance
        ref={circleRef}
        scale={scaleVector.clone().multiplyScalar(size)}
        userData={{ contourIndex: asContourIndex() }}
        onPointerDown={onClickDown}
        onPointerUp={onClickUp}
        color={resultColor}
      ></Instance>
      {/* <Text
        position={textPosition}
        // scale={scaleVector}
        scale={scaleVectorOf(POINT_SCALE_THREEJS * size)}
        color={color}
      >
        {index}
      </Text> */}
    </group>
  );
});

export default ContourPoint;
