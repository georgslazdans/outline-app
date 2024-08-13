import React, { useRef, useLayoutEffect, useEffect } from "react";
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
    const position = new Vector3();
    position.setFromMatrixPosition(l);
    position.multiplyScalar(1 / scale);

    if (onTranslationChange) {
      onTranslationChange(position);
    }

    const rotation = new Euler();
    rotation.setFromRotationMatrix(l);
    const degrees = (radians: number) => (radians * 180) / Math.PI;
  };

  const offsetOf = (position?: Vector3): [number, number, number] => {
    if (position) {
      const { x, y, z } = position;
      return [x, y, z];
    } else {
      return [0, 0, 0];
    }
  };

  const selected = useSelect().map((sel) => sel.userData.store);

  return (
    <PivotControls
      enabled={enableGizmo}
      disableScaling={true}
      onDrag={handleDragging}
      offset={offsetOf(position)}
    >
      <group
        scale={[scale, scale, scale]}
        position={position}
        userData={{ id: id }}
      >
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
