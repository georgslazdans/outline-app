"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";

import {
  ContactShadows,
  Edges,
  Environment,
  MapControls,
  MeshTransmissionMaterial,
  OrbitControls,
  Sky,
  useCursor,
  useSelect,
} from "@react-three/drei";
import SvgSelect from "./SvgSelect";
import SvgMesh from "./SvgMesh";
import { ContourPoints } from "@/lib/Point";
import SvgPoint from "./SvgPoint";
import { Vector3 } from "three";

type Props = {
  dictionary: Dictionary;
};

function Cube({
  color = "white",
  thickness = 1,
  roughness = 0.5,
  envMapIntensity = 1,
  transmission = 1,
  metalness = 0,
  ...props
}) {
  const [hovered, setHover] = useState(false);
  const selected = useSelect().map((sel) => sel.userData.store);
  const [store, materialProps] = [
    selected,
    {
      color: color,
      roughness: roughness,
      thickness: thickness,
      envMapIntensity: envMapIntensity,
      transmission: transmission,
      ...(metalness !== undefined && {
        metalness: metalness,
      }),
    },
  ];
  const isSelected = !!selected.find((sel) => sel === store);
  useCursor(hovered);
  return (
    <mesh
      {...props}
      userData={{ store }}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry />
      <MeshTransmissionMaterial
        resolution={128}
        samples={16}
        {...materialProps}
      />
      <Edges visible={isSelected} scale={1.1} renderOrder={1000}>
        <meshBasicMaterial transparent color="#333" depthTest={false} />
      </Edges>
    </mesh>
  );
}

const EditorCanvas = ({ dictionary }: Props) => {
  const [selected, setSelected] = useState<ContourPoints[]>();
  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  return (
    <>
      <Canvas
        dpr={[1, 4]}
        orthographic
        camera={{ position: [0, 0, 15], zoom: 1 }}
      >
        <pointLight position={[10, 10, 10]} />
        {selected && (
          <SvgMesh
            contoursPoints={selected}
            onPointMoveStart={() => setDisableCamera(true)}
            onPointMoveEnd={() => setDisableCamera(false)}
          ></SvgMesh>
        )}
        <Environment preset="city" />
        <ContactShadows
          frames={1}
          position={[0, -0.5, 0]}
          scale={10}
          opacity={0.4}
          far={1}
          blur={2}
        />
        {/* <OrbitControls
          makeDefault
          rotateSpeed={2}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
        /> */}
        <MapControls
          enableRotate={false}
          enabled={!disableCamera}
        ></MapControls>
        <Sky />
      </Canvas>
      <SvgSelect
        dictionary={dictionary}
        onSelect={(points) => setSelected(points)}
      ></SvgSelect>
    </>
  );
};

export default EditorCanvas;
