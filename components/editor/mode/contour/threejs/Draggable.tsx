"use client";

import { useEditorContext } from "@/components/editor/EditorContext";
import { DragControls } from "@react-three/drei";
import { ReactNode, useEffect, useState } from "react";
import { Matrix4, Vector3 } from "three";

type Props = {
  enabled: boolean;
  children: ReactNode;
  position: Vector3;
  onPointDrag: (l: Matrix4, _dl: Matrix4, w: Matrix4, dw: Matrix4) => void;
  onPointDragEnd?: () => void;
};

const Draggable = ({
  enabled,
  children,
  position,
  onPointDrag,
  onPointDragEnd,
}: Props) => {
  const { setDisableCamera, setTransformEditFocused } = useEditorContext();
  const [matrix, setMatrix] = useState(new Matrix4());

  useEffect(() => {
    const translationMatrix = new Matrix4();
    if (position) {
      translationMatrix.makeTranslation(position);
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
      onPointDrag(l, _dl, w, dw);
    }
  };

  // TODO disable component dynamically and so there is
  return (
    <>
      {/* {enabled ? ( */}
      {true ? (
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
      ) : (
        <>
          <group position={position}>{children}</group>
        </>
      )}
    </>
  );
};

export default Draggable;
