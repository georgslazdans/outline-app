"use client";

import Point3D, {
  toVector3,
  toEuler,
  fromVector3,
  fromEuler,
  zeroPoint,
} from "@/lib/Point3D";
import Item from "@/lib/replicad/model/Item";
import { PivotControls } from "@react-three/drei";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Euler, Matrix4, Vector3 } from "three";

type Props = {
  item: Item;
  children: ReactNode;
  enableGizmo: boolean;
  onItemChange: (item: Item) => void;
};

const SCALE = 0.01;

const TransformControls = ({
  item,
  children,
  enableGizmo,
  onItemChange,
}: Props) => {
  const [matrix, setMatrix] = useState(new Matrix4());

  const getPosition = useCallback(() => {
    let translation = zeroPoint();
    if (item.translation) {
      translation = item.translation;
    }
    return toVector3(translation).multiplyScalar(SCALE);
  }, [item.translation]);

  const getFullRotation = useCallback(() => {
    let rotation = zeroPoint();
    if (item.rotation) {
      rotation = item.rotation;
    }
    return toEuler(rotation);
  }, [item.rotation]);

  // Update transform matrix
  useEffect(() => {
    const position = getPosition();
    const rotation = getFullRotation();

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
  }, [getPosition, getFullRotation]);

  const handleTransformChange = useCallback(
    (translation: Vector3, rotation: Euler) => {
      if (item) {
        onItemChange({
          ...item,
          translation: fromVector3(translation),
          rotation: fromEuler(rotation),
        });
      }
    },
    [item, onItemChange]
  );

  const handleDragging = (l: Matrix4, dl: Matrix4, w: Matrix4) => {
    const pos = new Vector3();
    pos.setFromMatrixPosition(l);
    pos.multiplyScalar(1 / SCALE);

    const rotation = new Euler();
    rotation.setFromRotationMatrix(l);

    handleTransformChange(pos, rotation);
  };

  return (
    <>
      <PivotControls
        enabled={enableGizmo}
        disableScaling={true}
        autoTransform={false}
        matrix={matrix}
        onDrag={handleDragging}
        depthTest={false}
        scale={0.7}
        userData={{itemId: item.id}}
      >
        {children}
      </PivotControls>
    </>
  );
};

export default TransformControls;
