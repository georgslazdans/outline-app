"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useState } from "react";
import ReplicadMesh from "../../replicad/ReplicadMesh";
import { PivotControls } from "@react-three/drei";
import { Euler, Matrix4, Vector3 } from "three";
import { useEditorContext } from "../../EditorContext";
import Point3D, {
  add,
  addPoints,
  fromEuler,
  fromVector3,
  toEuler,
  toVector3,
} from "@/lib/Point3D";
import Item from "@/lib/replicad/Item";
import ModelType from "@/lib/replicad/ModelType";
import { useModelCache } from "../../cache/ModelCacheContext";
import ReplicadResult from "@/lib/replicad/WorkerResult";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
  parents?: Item[];
};

const EditItem = ({ dictionary, item, parents, onItemChange }: Props) => {
  const { wireframe, selectedId } = useEditorContext();

  const { getModel } = useModelCache();
  const [model, setModel] = useState<ReplicadResult>();

  const [matrix, setMatrix] = useState(new Matrix4());

  useEffect(() => {
    const work = getModel(item);
    work.promise.then((result) => {
      setModel(result);
    });
    return () => {
      work.cancel();
    };
  }, [getModel, item]);

  const isSelected = () => {
    return selectedId == item.id;
  };

  const enableGizmo = () => {
    const isNotGridfinity = item.type != ModelType.Gridfinity;
    return isNotGridfinity && isSelected();
  };

  const scale = 0.01;

  const parentPositionOf = (items?: Item[]): Point3D => {
    if (items) {
      const positions = items.map((it) => it.translation).filter((it) => !!it);
      return addPoints(positions);
    }
    return { x: 0, y: 0, z: 0 };
  };

  const getPosition = useCallback(() => {
    let translation = parentPositionOf(parents);
    if (item?.translation) {
      translation = add(translation, item.translation);
    }
    return toVector3(translation).multiplyScalar(scale);
  }, [item?.translation, parents]);

  const getRotation = useCallback(() => {
    const rotation = item?.rotation;
    if (rotation) {
      return toEuler(rotation);
    }
  }, [item?.rotation]);

  const handleTransformChange = useCallback(
    (translation: Vector3, rotation: Euler) => {
      if (item) {
        const newItem = {
          ...item,
          translation: fromVector3(translation),
          rotation: fromEuler(rotation),
        };
        onItemChange(newItem);
      }
    },
    [item, onItemChange]
  );

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

  const handleDragging = (l: Matrix4) => {
    const pos = new Vector3();
    pos.setFromMatrixPosition(l);
    pos.multiplyScalar(1 / scale);

    const rotation = new Euler();
    rotation.setFromRotationMatrix(l);

    handleTransformChange(pos, rotation);
  };

  const showWireframe = () => {
    if (item.type == ModelType.Gridfinity) {
      return wireframe;
    }
    return false;
  };

  const opacityOf = () => {
    if (item.type == ModelType.Gridfinity) {
      return wireframe ? 0 : 0.8;
    }
    return 1;
  };

  const colorOf = () => {
    if (item.type == ModelType.Gridfinity) {
      return "#2c7d94"; // dark-blue
    } else if (item.type == ModelType.Shadow) {
      return "#1296b6";
    } else {
      return "#BDBDBD";
    }
  };

  return (
    <>
      <PivotControls
        enabled={enableGizmo()}
        disableScaling={true}
        autoTransform={false}
        matrix={matrix}
        onDrag={handleDragging}
        depthTest={false}
        scale={0.7}
      >
        {model && (
          <ReplicadMesh
            faces={model.faces}
            edges={model.edges}
            wireframe={showWireframe()}
            opacity={opacityOf()}
            id={item.id}
            selected={isSelected()}
            color={colorOf()}
          ></ReplicadMesh>
        )}
      </PivotControls>
    </>
  );
};

export default EditItem;
