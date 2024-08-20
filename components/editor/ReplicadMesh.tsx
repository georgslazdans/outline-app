import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, Euler, Matrix4, Vector3 } from "three";
import {
  ReplicadMeshedEdges,
  syncFaces,
  syncLines,
  syncLinesFromFaces,
} from "replicad-threejs-helper";
import { ShapeMesh } from "replicad";
import { Outlines, PivotControls } from "@react-three/drei";

type Props = {
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
  enableGizmo: boolean;
  opacity: number;
  wireframe: boolean;
  onTransformChange?: (translation: Vector3, rotation: Euler) => void;
  position?: Vector3;
  rotation?: Euler;
  id?: string;
  selected?: boolean;
  color: string;
};

const ReplicadMesh = React.memo(function ShapeMeshes({
  faces,
  edges,
  enableGizmo,
  wireframe,
  onTransformChange,
  position,
  rotation,
  id,
  opacity,
  selected,
  color,
}: Props) {
  const { invalidate } = useThree();
  const [matrix, setMatrix] = useState(new Matrix4());

  useEffect(() => {
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
  }, [position, rotation]);

  const body = useRef(new BufferGeometry());
  const lines = useRef(new BufferGeometry());

  useLayoutEffect(() => {
    // We use the three helpers to synchronise the buffer geometry with the
    // new data from the parameters
    if (faces) syncFaces(body.current, faces);

    if (edges) syncLines(lines.current, edges);
    else if (faces) syncLinesFromFaces(lines.current, body.current);

    // We have configured the canvas to only refresh when there is a change,
    // the invalidate function is here to tell it to recompute
    invalidate();
  }, [faces, edges, invalidate]);

  useEffect(
    () => () => {
      body.current.dispose();
      lines.current.dispose();
      invalidate();
    },
    [invalidate]
  );

  const scale = 0.01;

  const handleDragging = (l: Matrix4) => {
    const pos = new Vector3();
    pos.setFromMatrixPosition(l);
    pos.multiplyScalar(1 / scale);

    const rotation = new Euler();
    rotation.setFromRotationMatrix(l);

    if (onTransformChange) {
      onTransformChange(pos, rotation);
    }
  };

  const outlineColor = selected ? "#DA4167" : "#1296b6";

  return (
    <PivotControls
      enabled={enableGizmo}
      disableScaling={true}
      autoTransform={false}
      matrix={matrix}
      onDrag={handleDragging}
      depthTest={false}
      scale={0.7}
    >
      <group
        scale={[scale, scale, scale]}
        userData={{ id: id }}
        renderOrder={selected ? -5000 : 0}
      >
        {!wireframe && (
          <mesh geometry={body.current} userData={{ id: id }}>
            <meshStandardMaterial
              color={color}
              polygonOffset
              polygonOffsetFactor={2.0}
              polygonOffsetUnits={1.0}
              transparent={opacity >= 1 ? false : true}
              opacity={opacity}
            />
            {body.current && body.current.index && (
              <Outlines thickness={selected ? 4 : 2} color={outlineColor} />
            )}
          </mesh>
        )}
        <lineSegments geometry={lines.current} userData={{ id: id }}>
          <lineBasicMaterial color={outlineColor} />
        </lineSegments>
      </group>
    </PivotControls>
  );
});

export default ReplicadMesh;
