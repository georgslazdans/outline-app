"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";

import SvgSelect from "./svg/SvgSelect";
import SvgMesh from "./svg/SvgMesh";
import { ContourPoints } from "@/lib/Point";
import { Object3D, Vector3 } from "three";
import { ReplicadWorker } from "./ReplicadWorker";
import { ReplicadResult } from "@/lib/replicad/Worker";
import ReplicadMesh from "./ReplicadMesh";
import { defaultGridfinityParams, fullWorkOf, ReplicadWork } from "@/lib/replicad/Work";
import ThreeJsContext from "./ThreeJsContext";
import { Select } from "@react-three/drei";

type Props = {
  dictionary: Dictionary;
};

const EditorCanvas = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const [selectedContour, setSelectedContour] = useState<ContourPoints[]>();
  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  const [replicadMessage, setReplicadMessage] = useState<ReplicadWork>();
  const [replicadResult, setReplicadResult] = useState<ReplicadResult>();

  const onContourSelect = (points: ContourPoints[]) => {
    setSelectedContour(points);
    setReplicadMessage(fullWorkOf(points, defaultGridfinityParams()));
  };

  const [selected, setSelected] = useState<Object3D[]>();
  console.log("Selected", selected);
  return (
    <>
      <ReplicadWorker
        message={replicadMessage}
        onWorkerMessage={setReplicadResult}
      ></ReplicadWorker>
      <ThreeJsContext dictionary={dictionary} disableCamera={disableCamera}>
        <Select onChange={(obj) => setSelected(obj)}>
          {replicadResult && (
            <ReplicadMesh
              faces={replicadResult.faces}
              edges={replicadResult.edges}
            ></ReplicadMesh>
          )}
          {selectedContour && (
            <SvgMesh
              contoursPoints={selectedContour}
              onPointMoveStart={() => setDisableCamera(true)}
              onPointMoveEnd={() => setDisableCamera(false)}
            ></SvgMesh>
          )}
        </Select>
      </ThreeJsContext>
      <SvgSelect dictionary={dictionary} onSelect={onContourSelect}></SvgSelect>
    </>
  );
};

export default EditorCanvas;
