"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

import { Sky } from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import CameraControls from "./CameraControls";

type Props = {
  dictionary: Dictionary;
  children: ReactNode;
};

const ThreeJsEnvironment = ({ dictionary, children }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const dpr = Math.min(window.devicePixelRatio, 2);
  return (
    <>
      <Canvas
        dpr={dpr}
        orthographic
        frameloop="demand"
        camera={{ position: [0, 0, 2], zoom: 100, near: 0.00001, fov: 90 }}
      >
        <CameraControls></CameraControls>
        <directionalLight position={[10, 10, 10]} />
        <directionalLight position={[-10, -10, 5]} args={[0xffffff, 0.3]} />
        {children}

        <Sky />
        <gridHelper
          args={[100, 200]}
          scale={[0.1, 0.1, 0.1]}
          rotation={[Math.PI / 2, 0, 0]}
        ></gridHelper>
      </Canvas>
    </>
  );
};

export default ThreeJsEnvironment;
