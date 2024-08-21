"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";

import { Object3D, Vector3 } from "three";
import ThreeJsEnvironment from "./ThreeJsEnvironment";
import { gridfinityItemOf } from "@/lib/replicad/Model";
import { defaultGridfinityParams } from "@/lib/replicad/GridfinityParams";
import WireframeButton from "./ui/WireframeButton";
import EditorMode from "./EditorMode";
import ResultMode from "./mode/result/ResultMode";
import EditMode from "./mode/edit/EditMode";
import ContourMode from "./mode/contour/ContourMode";
import { ModelData } from "@/lib/replicad/ModelData";
import ModelName from "./ui/ModelName";
import { useEditorContext } from "./EditorContext";
import RenderButton from "./ui/RenderButton";

type Props = {
  dictionary: Dictionary;
};

const EditorComponent = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const { editorMode } = useEditorContext();

  const [modelData, setModelData] = useState<ModelData>({
    items: [gridfinityItemOf(defaultGridfinityParams())],
  });

  const editMode = EditMode({
    dictionary,
    modelData,
    setModelData,
  });
  const resultMode = ResultMode({
    dictionary,
    modelData,
  });

  const contourMode = ContourMode({
    dictionary,
    modelData,
    setModelData,
  });

  const editorModes = {
    [EditorMode.EDIT]: editMode,
    [EditorMode.RESULT]: resultMode,
    [EditorMode.CONTOUR_EDIT]: contourMode,
  };

  const currentEditorMode = editorModes[editorMode];

  return (
    <>
      <ModelName dictionary={dictionary}></ModelName>
      <div className="flex flex-col xl:flex-row gap-2">
        <div className="w-full xl:w-1/2">
          <div className="w-full h-[60vh]">
            <div className="z-10 relative">
              <WireframeButton></WireframeButton>
            </div>
            <ThreeJsEnvironment dictionary={dictionary}>
              {currentEditorMode ? currentEditorMode.view() : null}
            </ThreeJsEnvironment>
          </div>
          <div className="flex flex-row gap-2">
            <RenderButton dictionary={dictionary}></RenderButton>
          </div>
        </div>

        <div className="w-full xl:w-1/2">
          {currentEditorMode ? currentEditorMode.toolbar() : null}
        </div>
      </div>
    </>
  );
};

export default EditorComponent;
