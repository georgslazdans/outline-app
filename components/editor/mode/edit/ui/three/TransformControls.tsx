"use client";

import { useEditorContext } from "@/components/editor/EditorContext";
import {
  toVector3,
  toEuler,
  fromVector3,
  fromEuler,
  zeroPoint,
} from "@/lib/Point3D";
import Item from "@/lib/replicad/model/Item";
import useDebounced from "@/lib/utils/Debounced";
import { PivotControls } from "@react-three/drei";
import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Euler, Matrix4, Vector3 } from "three";

type Props = {
  item: Item;
  children: ReactNode;
  enableGizmo: boolean;
  onItemChange: (item: Item) => void;
};

const SCALE = 0.01;

const TransformControls = memo(function TransformControls({
  item,
  children,
  enableGizmo,
  onItemChange: _onItemChanged,
}: Props) {
  const { setTransformEditFocused } = useEditorContext();
  const [matrix, setMatrix] = useState(new Matrix4());
  const { onChange: onItemChange, flush: flushChanges } =
    useDebounced(_onItemChanged);

  const getPosition = useCallback(() => {
    let translation = zeroPoint();
    if (item.translation) {
      translation = item.translation;
    }
    return toVector3(translation).multiplyScalar(SCALE);
  }, [item]);

  const getRotation = useCallback(() => {
    let rotation = zeroPoint();
    if (item.rotation) {
      rotation = item.rotation;
    }
    return toEuler(rotation);
  }, [item]);

  // Update transform matrix
  useEffect(() => {
    const position = getPosition();
    const rotation = getRotation();

    const translationMatrix = new Matrix4();
    const rotationMatrix = new Matrix4();

    if (position) {
      translationMatrix.makeTranslation(position);
    }
    if (rotation) {
      rotationMatrix.makeRotationFromEuler(rotation);
    }

    if (position || rotation) {
      const updatedMatrix = translationMatrix;
      updatedMatrix.multiply(rotationMatrix);
      setMatrix(updatedMatrix);
    }
  }, [getPosition, getRotation]);

  const handleTransformChange = useCallback(
    (translation: Vector3, rotation: Euler) => {
      onItemChange({
        ...item,
        translation: fromVector3(translation),
        rotation: fromEuler(rotation),
      });
    },
    [item, onItemChange]
  );

  const handleDragging = (local: Matrix4) => {
    setMatrix(local); // Since onItemChanged is debounced, update matrix immediately

    const pos = new Vector3();
    pos.setFromMatrixPosition(local);
    pos.multiplyScalar(1 / SCALE);

    const rotation = new Euler();
    rotation.setFromRotationMatrix(local);

    handleTransformChange(pos, rotation);
  };

  const onDragEnd = () => {
    setTransformEditFocused(false);
    flushChanges();
  };
  return (
    <>
      <PivotControls
        enabled={enableGizmo}
        disableScaling={true}
        autoTransform={false}
        matrix={matrix}
        onDrag={handleDragging}
        onDragStart={() => setTransformEditFocused(true)}
        onDragEnd={onDragEnd}
        depthTest={false}
        scale={0.7}
        userData={{ itemId: item.id }}
      >
        {children}
      </PivotControls>
    </>
  );
});

export default TransformControls;
