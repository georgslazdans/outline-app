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
};

const Draggable = ({ enabled, children, position, onPointDrag }: Props) => {
  const { setDisableCamera } = useEditorContext();
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
  };
  const onDragEnd = () => {
    setDisableCamera(false);
  };

  const onDrag = (l: Matrix4, _dl: Matrix4, w: Matrix4, dw: Matrix4) => {
    onPointDrag(l, _dl, w, dw);
  };

  return (
    <>
      {enabled ? (
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
