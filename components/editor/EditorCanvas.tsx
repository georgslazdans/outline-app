"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";

import SvgSelect from "./SvgSelect";
import SvgMesh from "./SvgMesh";
import { ContourPoints } from "@/lib/Point";
import { Object3D, Vector3 } from "three";
import { ReplicadWorker } from "./ReplicadWorker";
import { ReplicadResult } from "@/lib/replicad/Worker";
import ReplicadMesh from "./ReplicadMesh";
import { fullWorkOf, ReplicadWork } from "@/lib/replicad/Work";
import ThreeJsContext from "./ThreeJsContext";

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
    setReplicadMessage(fullWorkOf(points));
  };

  return (
    <>
      <ReplicadWorker
        message={replicadMessage}
        onWorkerMessage={setReplicadResult}
      ></ReplicadWorker>
      <ThreeJsContext dictionary={dictionary} disableCamera={disableCamera}>
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
      </ThreeJsContext>
      <SvgSelect dictionary={dictionary} onSelect={onContourSelect}></SvgSelect>
    </>
  );
};

export default EditorCanvas;
