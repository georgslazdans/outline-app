import { Circle, DragControls, Outlines, Sphere } from "@react-three/drei";
import React, { memo, useEffect, useRef, useState } from "react";
import { Matrix4, Vector3 } from "three";
import ContourIndex from "../ContourIndex";
import { POINT_SCALE_THREEJS } from "@/lib/point/Point";

type Props = {
  index: number;
  contourIndex: number;
  color: "red" | "black";
};

const PointMesh = memo(function PointMesh({
  contourIndex,
  index,
  color
}: Props) {
  const pointRef = useRef<any>();
  const circleRef = useRef<any>();

  const asContourIndex = (): ContourIndex => {
    return { contour: contourIndex, point: index };
  };

  return (
      <Sphere
        ref={pointRef}
        scale={[POINT_SCALE_THREEJS, POINT_SCALE_THREEJS, POINT_SCALE_THREEJS]}
        userData={{ contourIndex: asContourIndex() }}
      >
        <meshBasicMaterial color={color} transparent={true} opacity={0}/>
        <Outlines thickness={2.5} color="white" />
        <Outlines thickness={5} color={color} />
      </Sphere>
  );
});

export default PointMesh;
