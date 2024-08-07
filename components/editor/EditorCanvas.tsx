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
import { Object3D, Vector3 } from "three";
import { ReplicadWorker } from "./ReplicadWorker";
import { ReplicadResult, ReplicadWork } from "@/lib/replicad/Worker";
import ReplicadMesh from "./ReplicadMesh";

type Props = {
  dictionary: Dictionary;
};

const EditorCanvas = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const [selected, setSelected] = useState<ContourPoints[]>();
  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  const [replicadMessage, setReplicadMessage] = useState<ReplicadWork>();
  const [replicadResult, setReplicadResult] = useState<ReplicadResult>();

  const onContourSelect = (points: ContourPoints[]) => {
    setSelected(points);
    setReplicadMessage({
      shadow: points,
      height: 10,
    });
  };

  const dpr = Math.min(window.devicePixelRatio, 2);
  return (
    <>
      <ReplicadWorker
        message={replicadMessage}
        onWorkerMessage={setReplicadResult}
      ></ReplicadWorker>
      <Canvas
        dpr={dpr}
        orthographic
        camera={{ position: [0, 0, 2], zoom: 100, near: 0.00001, fov: 90 }}
        gl={{ precision: "highp", logarithmicDepthBuffer: true }}
      >
        <pointLight position={[10, 10, 10]} />
        {replicadResult && (
          <ReplicadMesh
            faces={replicadResult.faces}
            edges={replicadResult.edges}
          ></ReplicadMesh>
        )}
        {selected && (
          <SvgMesh
            contoursPoints={selected}
            onPointMoveStart={() => setDisableCamera(true)}
            onPointMoveEnd={() => setDisableCamera(false)}
          ></SvgMesh>
        )}
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
        {/* <MapControls
          enableRotate={false}
          enabled={!disableCamera}
        ></MapControls> */}
        <Sky />
        <gridHelper
          args={[100, 200]}
          scale={[0.1, 0.1, 0.1]}
          rotation={[Math.PI / 2, 0, 0]}
        ></gridHelper>
      </Canvas>
      <SvgSelect dictionary={dictionary} onSelect={onContourSelect}></SvgSelect>
    </>
  );
};

export default EditorCanvas;
