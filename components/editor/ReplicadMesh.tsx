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
import { PivotControls, useSelect } from "@react-three/drei";

type Props = {
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
  enableGizmo: boolean;
  wireframe: boolean;
  onTranslationChange?: (translation: Vector3) => void;
  position?: Vector3;
  id?: string;
};

const ReplicadMesh = React.memo(function ShapeMeshes({
  faces,
  edges,
  enableGizmo,
  wireframe,
  onTranslationChange,
  position,
  id,
}: Props) {
  const { invalidate } = useThree();
  const [matrix, setMatrix] = useState(new Matrix4());

  useEffect(() => {
    if (position) {
      const updatedMatrix = new Matrix4();
      updatedMatrix.makeTranslation(position);
      setMatrix(updatedMatrix);
    }
  }, [position]);

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

    if (onTranslationChange) {
      onTranslationChange(pos);
    }

    const rotation = new Euler();
    rotation.setFromRotationMatrix(l);
    const degrees = (radians: number) => (radians * 180) / Math.PI;
  };

  // const selected = useSelect().map((sel) => sel.userData.store);

  return (
    <PivotControls
      enabled={enableGizmo}
      disableScaling={true}
      autoTransform={false}
      matrix={matrix}
      onDrag={handleDragging}
    >
      <group scale={[scale, scale, scale]} userData={{ id: id }}>
        {!wireframe && (
          <mesh geometry={body.current} userData={{ id: id }}>
            <meshStandardMaterial
              color="#5a8296"
              polygonOffset
              polygonOffsetFactor={2.0}
              polygonOffsetUnits={1.0}
            />
          </mesh>
        )}
        <lineSegments geometry={lines.current} userData={{ id: id }}>
          <lineBasicMaterial color="#3c5a6e" />
        </lineSegments>
      </group>
    </PivotControls>
  );
});

export default ReplicadMesh;
