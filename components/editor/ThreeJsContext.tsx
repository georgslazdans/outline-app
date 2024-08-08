"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

import {
  ContactShadows,
  OrbitControls,
  Sky,
} from "@react-three/drei";
import { Object3D, Vector3 } from "three";

type Props = {
  dictionary: Dictionary;
  disableCamera: boolean;
  children: ReactNode;
};

const ThreeJsContext = ({ dictionary, disableCamera, children }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const dpr = Math.min(window.devicePixelRatio, 2);
  return (
    <>
      <Canvas
        dpr={dpr}
        orthographic
        camera={{ position: [0, 0, 2], zoom: 100, near: 0.00001, fov: 90 }}
        gl={{ precision: "highp", logarithmicDepthBuffer: true }}
      >
        <pointLight position={[10, 10, 10]} />
        {children}
        {/* <Environment preset="city" /> */}
        <ContactShadows
          frames={1}
          position={[0, -0.5, 0]}
          scale={10}
          opacity={0.4}
          far={1}
          blur={2}
        />
        <OrbitControls
          makeDefault
          //   rotateSpeed={2}
          //   minPolarAngle={0}
          //   maxPolarAngle={Math.PI / 2.5}
          enabled={!disableCamera}
        />
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

export default ThreeJsContext;
