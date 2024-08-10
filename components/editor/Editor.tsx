"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";

import { Object3D, Vector3 } from "three";
import { ModelData } from "@/lib/replicad/Work";
import ThreeJsContext from "./ThreeJsContext";
import { gridfinityItemOf } from "@/lib/replicad/Model";
import { defaultGridfinityParams } from "@/lib/replicad/GridfinityParams";
import EditMode from "./mode/EditMode";
import Button from "../Button";
import EditToolbar from "./mode/EditToolbar";
import WireframeButton from "./WireframeButton";
import ResultMode from "./mode/ResultMode";

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

  const [wireframe, setWireframe] = useState(false);

  const onModelDataChange = (data: ModelData) => {
    setModelData(data);
    console.log("Data changed", data);
  };

  const onFullRender = () => {
    if (editorMode != EditorMode.RESULT) {
      setEditorMode(EditorMode.RESULT);
    } else {
      setEditorMode(EditorMode.EDIT);
    }
  };

  const editorModes = {
    [EditorMode.EDIT]: {
      view: (
        <EditMode
          dictionary={dictionary}
          modelData={modelData}
          onModelDataChange={onModelDataChange}
          wireframe={wireframe}
        ></EditMode>
      ),
      toolbar: (
        <EditToolbar
          dictionary={dictionary}
          modelData={modelData}
          onModelDataUpdate={setModelData}
        ></EditToolbar>
      ),
    },
    [EditorMode.RESULT]: {
      view: (
        <ResultMode
          dictionary={dictionary}
          modelData={modelData}
          wireframe={wireframe}
        ></ResultMode>
      ),
      toolbar: <></>,
    },
    [EditorMode.CONTOUR_EDIT]: {
      view: (
        <ResultMode
          dictionary={dictionary}
          modelData={modelData}
          wireframe={wireframe}
        ></ResultMode>
      ),
      toolbar: <></>,
    },
  };

  return (
    <>
      <div className="w-full h-[70vh]">
        <div className="z-10 relative">
          <WireframeButton
            icon={wireframe ? "eye-slash" : "eye"}
            onClick={() => setWireframe(!wireframe)}
          ></WireframeButton>
        </div>
        <ThreeJsContext dictionary={dictionary} disableCamera={disableCamera}>
          {editorModes[editorMode].view}
        </ThreeJsContext>
      </div>
      {editorModes[editorMode].toolbar}

      <Button onClick={onFullRender}>Render</Button>
    </>
  );
};

export default Editor;
