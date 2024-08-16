"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";

import { Object3D, Vector3 } from "three";
import { ModelData } from "@/lib/replicad/Work";
import ThreeJsContext from "./ThreeJsContext";
import { gridfinityItemOf } from "@/lib/replicad/Model";
import { defaultGridfinityParams } from "@/lib/replicad/GridfinityParams";
import Button from "../Button";
import WireframeButton from "./WireframeButton";
import { ModelCacheProvider } from "@/context/ModelCacheContext";
import EditorMode from "./EditorMode";
import ResultMode from "./mode/result/ResultMode";
import EditMode from "./mode/edit/EditMode";
import ContourMode from "./mode/contour/ContourMode";

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

  const [selectedId, setSelectedId] = useState<string>();

  const onFullRenderButton = () => {
    if (editorMode != EditorMode.RESULT) {
      setEditorMode(EditorMode.RESULT);
    } else {
      setEditorMode(EditorMode.EDIT);
    }
  };

  const editMode = EditMode({
    dictionary: dictionary,
    modelData: modelData,
    wireframe: wireframe,
    setModelData: setModelData,
    selectedId: selectedId,
    setSelectedId: setSelectedId,
    setEditorMode: setEditorMode,
  });
  const resultMode = ResultMode({
    dictionary: dictionary,
    modelData: modelData,
    wireframe: wireframe,
  });

  const contourMode = ContourMode({
    dictionary,
    modelData,
    onModelDataChange: setModelData,
    selectedId,
    setDisableCamera,
  });

  const editorModes = {
    [EditorMode.EDIT]: editMode,
    [EditorMode.RESULT]: resultMode,
    [EditorMode.CONTOUR_EDIT]: contourMode,
  };

  const currentEditorMode = editorModes[editorMode];

  return (
    <>
      <ModelCacheProvider>
        <div className="flex flex-col xl:flex-row gap-2">
          <div className="w-full xl:w-1/2">
            <div className="w-full h-[60vh]">
              <div className="z-10 relative">
                <WireframeButton
                  icon={wireframe ? "eye-slash" : "eye"}
                  onClick={() => setWireframe(!wireframe)}
                ></WireframeButton>
              </div>
              <ThreeJsContext
                dictionary={dictionary}
                disableCamera={disableCamera}
              >
                {currentEditorMode ? currentEditorMode.view() : null}
              </ThreeJsContext>
            </div>
            <Button className="mt-2" onClick={onFullRenderButton}>
              <label>
                {editorMode == EditorMode.RESULT ? "Edit" : "Render"}
              </label>
            </Button>
          </div>

          <div className="w-full xl:w-1/2">
          {currentEditorMode ? currentEditorMode.toolbar() : null}
          </div>
        </div>
      </ModelCacheProvider>
    </>
  );
};

export default Editor;
