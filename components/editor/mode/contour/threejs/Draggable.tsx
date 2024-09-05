"use client";

import { useEditorContext } from "@/components/editor/EditorContext";
import Point from "@/lib/data/Point";
import { DragControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useState } from "react";
import { Matrix4, Vector3 } from "three";

type Props = {
  enabled: boolean;
  children: ReactNode;
  position: Point;
  onPointDrag: (point: Point) => void;
  onPointDragEnd?: () => void;
};

const pos = new Vector3();
const delta = new Vector3();

const Draggable = ({
  enabled,
  children,
  position,
  onPointDrag,
  onPointDragEnd,
}: Props) => {
  const { invalidate } = useThree();
  const { setDisableCamera, setTransformEditFocused } = useEditorContext();
  const [matrix, setMatrix] = useState(new Matrix4());

  useEffect(() => {
    if (position) {
      const translationMatrix = new Matrix4();
      pos.set(position.x, position.y, 0);
      translationMatrix.setPosition(pos);
      setMatrix(translationMatrix);
    }
  }, [position]);

  const onDragStart = () => {
    setDisableCamera(true);
    setTransformEditFocused(true);
  };

  const onDragEnd = () => {
    setDisableCamera(false);
    setTimeout(() => {
      setTransformEditFocused(false);
    });
    if (onPointDragEnd) {
      onPointDragEnd();
    }
  };

  const onDrag = (l: Matrix4, _dl: Matrix4, w: Matrix4, dw: Matrix4) => {
    if (enabled) {
      pos.setFromMatrixPosition(w);
      delta.setFromMatrixPosition(dw);

      onPointDrag({ x: pos.x + delta.x, y: pos.y + delta.y });
      invalidate();
    }
  };

  return (
    <>
      <DragControls
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        axisLock="z"
        onDrag={onDrag}
        autoTransform={false}
        matrix={matrix}
      >
        {children}
      </DragControls>
    </>
  );
};

export default Draggable;
