"use client";

import Point3D, {
  toVector3,
  toEuler,
  fromVector3,
  fromEuler,
  addPoints,
  add,
} from "@/lib/Point3D";
import Item from "@/lib/replicad/model/Item";
import { PivotControls } from "@react-three/drei";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Euler, Matrix4, Vector3 } from "three";

type Props = {
  item: Item;
  parents?: Item[];
  children: ReactNode;
  enableGizmo: boolean;
  onItemChange: (item: Item) => void;
};

const SCALE = 0.01;

const TransformControls = ({
  item,
  parents,
  children,
  enableGizmo,
  onItemChange,
}: Props) => {
  const [matrix, setMatrix] = useState(new Matrix4());

  const parentPositionOf = (items?: Item[]): Point3D => {
    if (items) {
      const positions = items
        .map((it) => it.translation)
        .filter((it) => it != undefined && it != null);
      if (positions && positions.length > 0) {
        //ts-ignore
        return addPoints(positions);
      }
    }
    return { x: 0, y: 0, z: 0 };
  };

  const getPosition = useCallback(() => {
    let translation = parentPositionOf(parents);
    if (item.translation) {
      translation = add(translation, item.translation);
    }
    return toVector3(translation).multiplyScalar(SCALE);
  }, [item.translation, parents]);

  const getRotation = useCallback(() => {
    const rotation = item.rotation;
    if (rotation) {
      return toEuler(rotation);
    }
  }, [item.rotation]);

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
      if (item) {
        const parentPosition = toVector3(parentPositionOf(parents));
        const newItem = {
          ...item,
          translation: fromVector3(translation.sub(parentPosition)),
          rotation: fromEuler(rotation),
        };
        onItemChange(newItem);
      }
    },
    [item, onItemChange, parents]
  );

  const handleDragging = (l: Matrix4, dl: Matrix4, w: Matrix4) => {
    const pos = new Vector3();
    pos.setFromMatrixPosition(w);
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
      >
        {children}
      </PivotControls>
    </>
  );
};

export default TransformControls;
