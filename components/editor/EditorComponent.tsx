"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import { Object3D, Vector3 } from "three";
import ThreeJsEnvironment from "./ThreeJsEnvironment";
import EditorMode from "./mode/EditorMode";
import ResultMode from "./mode/result/ResultMode";
import EditMode from "./mode/edit/EditMode";
import ContourMode from "./mode/contour/ContourMode";
import { useEditorContext } from "./EditorContext";
import UndoButton from "./ui/canvas/UndoButton";
import RedoButton from "./ui/canvas/RedoButton";
import ModelName from "./ui/ModelName";
import SaveModel from "./ui/SaveModel";
import WireframeButton from "./ui/canvas/WireframeButton";
import RenderButton from "./ui/RenderButton";
import LoadingIndicator from "./ui/canvas/LoadingIndicator";

type Props = {
  dictionary: Dictionary;
};

const EditorComponent = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const { editorMode } = useEditorContext();

  const editorModes = {
    [EditorMode.EDIT]: EditMode({
      dictionary,
    }),
    [EditorMode.RESULT]: ResultMode({
      dictionary,
    }),
    [EditorMode.CONTOUR_EDIT]: ContourMode({
      dictionary,
    }),
  };

  const currentEditorMode = editorModes[editorMode];

  return (
    <>
      <ModelName dictionary={dictionary}></ModelName>
      <div className="flex flex-col xl:flex-row gap-2">
        <div className="w-full xl:w-1/2">
          <div className="w-full h-[60vh]">
            <div className="z-10 relative">
              <div className="absolute flex flex-col">
                <div className="flex flex-row">
                  <UndoButton></UndoButton>
                  <RedoButton></RedoButton>
                </div>
                <WireframeButton></WireframeButton>
                <LoadingIndicator></LoadingIndicator>
              </div>
            </div>
            <ThreeJsEnvironment dictionary={dictionary}>
              {currentEditorMode ? currentEditorMode.view() : null}
            </ThreeJsEnvironment>
          </div>
          <div className="flex flex-row gap-2">
            {editorMode != EditorMode.CONTOUR_EDIT && (
              <RenderButton dictionary={dictionary}></RenderButton>
            )}
            <SaveModel dictionary={dictionary}></SaveModel>
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
