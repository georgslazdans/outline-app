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
import { fullWorkOf, ModelData, ReplicadWork } from "@/lib/replicad/Work";
import ThreeJsContext from "./ThreeJsContext";
import { Select } from "@react-three/drei";
import { gridfinityItemOf, shadowItemOf } from "@/lib/replicad/Model";
import { defaultGridfinityParams } from "@/lib/replicad/GridfinityParams";
import EditMode from "./mode/EditMode";

enum EditorMode {
  EDIT,
  CONTOUR_EDIT,
  RESULT,
}

type Props = {
  dictionary: Dictionary;
};

const Editor = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.EDIT);

  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  const [modelData, setModelData] = useState<ModelData>({
    items: [gridfinityItemOf(defaultGridfinityParams())],
  });

  const onModelDataChange = (data: ModelData) => {
    console.log("Data changed", data);
  };
  return (
    <>
      <ThreeJsContext dictionary={dictionary} disableCamera={disableCamera}>
        <EditMode
          dictionary={dictionary}
          modelData={modelData}
          onModelDataChange={onModelDataChange}
        ></EditMode>
      </ThreeJsContext>
    </>
  );
};

export default Editor;
