import { Circle, DragControls, Outlines, Sphere } from "@react-three/drei";
import React, { memo, useEffect, useRef, useState } from "react";
import { Matrix4, Vector3 } from "three";
import ContourIndex from "../ContourIndex";

type Props = {
  index: number;
  contourIndex: number;
  position: Vector3;
  color: "red" | "black";
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrag: (l: Matrix4, dl: Matrix4, w: Matrix4, dW: Matrix4) => void;
};

const SvgPoint = memo(function PointMesh({
  contourIndex,
  index,
  position,
  color,
  onDragStart,
  onDragEnd,
  onDrag,
}: Props) {
  const pointRef = useRef<any>();
  const circleRef = useRef<any>();
  const [matrix, setMatrix] = useState(new Matrix4());

  useEffect(() => {
    const translationMatrix = new Matrix4();
    if (position) {
      translationMatrix.makeTranslation(position);
      setMatrix(translationMatrix);
    }
  }, [position]);

  const asContourIndex = (): ContourIndex => {
    return { contour: contourIndex, point: index };
  };

  const pointSize = 0.01;
  return (
    <DragControls
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      axisLock="z"
      onDrag={onDrag}
      autoTransform={false}
      matrix={matrix}
    >
      <Sphere
        ref={pointRef}
        scale={[pointSize, pointSize, pointSize]}
        userData={{ contourIndex: asContourIndex() }}
      >
        <meshBasicMaterial color={color} transparent={true} opacity={0}/>
        <Outlines thickness={2.5} color="white" />
        <Outlines thickness={5} color={color} />
      </Sphere>
    </DragControls>
  );
});

export default SvgPoint;
