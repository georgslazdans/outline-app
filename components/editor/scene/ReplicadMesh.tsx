import React, { useRef, useLayoutEffect, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry } from "three";
import {
  ReplicadMeshedEdges,
  syncFaces,
  syncLines,
  syncLinesFromFaces,
} from "replicad-threejs-helper";
import { ShapeMesh } from "replicad";
import { Outlines } from "@react-three/drei";
import { POINT_SCALE_THREEJS } from "@/lib/data/Point";

type Props = {
  faces: ShapeMesh;
  edges: ReplicadMeshedEdges;
  opacity: number;
  wireframe: boolean;

  id?: string;
  selected?: boolean;
  color: string;
};

const ReplicadMesh = React.memo(function ShapeMeshes({
  faces,
  edges,
  wireframe,
  id,
  opacity,
  selected,
  color,
}: Props) {
  const { invalidate } = useThree();

  const body = useRef(new BufferGeometry());
  const lines = useRef(new BufferGeometry());

  useLayoutEffect(() => {
    if (faces) syncFaces(body.current, faces);

    if (edges) syncLines(lines.current, edges);
    else if (faces) syncLinesFromFaces(lines.current, body.current);

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

  const outlineColor = selected ? "#DA4167" : "#1296b6";

  return (
    <group
      scale={[POINT_SCALE_THREEJS, POINT_SCALE_THREEJS, POINT_SCALE_THREEJS]}
      userData={{ id: id }}
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
        </mesh>
      )}
      <lineSegments geometry={lines.current} userData={{ id: id }}>
        <lineBasicMaterial color={outlineColor} />
      </lineSegments>
    </group>
  );
});

export default ReplicadMesh;
