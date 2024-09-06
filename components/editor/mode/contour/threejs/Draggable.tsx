"use client";

import { useEditorContext } from "@/components/editor/EditorContext";
import Point from "@/lib/data/Point";
import { truncateNumber } from "@/lib/utils/Math";
import { DragControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useState } from "react";
import { Matrix4, Vector3 } from "three";
import { usePointClickContext } from "../selection/PointClickContext";
import PointClickMode from "../selection/PointClickMode";

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
  const { clickMode } = usePointClickContext();
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
    if (enabled && clickMode == PointClickMode.SELECTION) {
      pos.setFromMatrixPosition(w);
      delta.setFromMatrixPosition(dw);

      onPointDrag({
        x: truncateNumber(pos.x + delta.x, 5),
        y: truncateNumber(pos.y + delta.y, 5),
      });
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
