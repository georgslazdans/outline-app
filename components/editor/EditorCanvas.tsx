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
import { Object3D, Vector3 } from "three";
import { ReplicadWorker } from "./ReplicadWorker";
import { ReplicadResult } from "@/lib/replicad/Worker";
import ReplicadMesh from "./ReplicadMesh";

type Props = {
  dictionary: Dictionary;
};

Object3D.DEFAULT_UP.set(0, 0, 1);

const EditorCanvas = ({ dictionary }: Props) => {
  const [selected, setSelected] = useState<ContourPoints[]>();
  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  const [replicadMessage, setReplicadMessage] = useState({});
  const [replicadResult, setReplicadResult] = useState<ReplicadResult>();
  return (
    <>
      <ReplicadWorker
        message={replicadMessage}
        onWorkerMessage={setReplicadResult}
      ></ReplicadWorker>
      <Canvas
        dpr={[1, 4]}
        orthographic
        camera={{ position: [0, 0, 15], zoom: 1, near: 0.001, far: 3000}}
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
        <Environment preset="city" />
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
      </Canvas>
      <SvgSelect
        dictionary={dictionary}
        onSelect={(points) => setSelected(points)}
      ></SvgSelect>
    </>
  );
};

export default EditorCanvas;
