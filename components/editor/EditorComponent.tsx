"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useEffect } from "react";
import { Object3D, Vector3 } from "three";
import ThreeJsEnvironment from "./ThreeJsEnvironment";
import EditorMode from "./mode/EditorMode";
import ResultMode from "./mode/result/ResultMode";
import EditMode from "./mode/edit/EditMode";
import ContourMode from "./mode/contour/ContourMode";
import ModelData from "@/lib/replicad/ModelData";
import { useEditorContext } from "./EditorContext";
import { useModelContext } from "../../context/ModelContext";
import { useEditorHistoryContext } from "./history/EditorHistoryContext";
import UndoButton from "./ui/UndoButton";
import RedoButton from "./ui/RedoButton";
import EditorHistoryType from "./history/EditorHistoryType";
import ModelName from "./ui/ModelName";
import SaveModel from "./ui/SaveModel";
import WireframeButton from "./ui/WireframeButton";
import RenderButton from "./ui/RenderButton";

type Props = {
  dictionary: Dictionary;
};

export type UpdateModelData = (
  modelData: ModelData,
  type: EditorHistoryType,
  id?: string
) => void;

const EditorComponent = ({ dictionary }: Props) => {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const { editorMode, selectedId, selectedPoint } = useEditorContext();
  const { model, setModel } = useModelContext();
  const { addHistoryEvent } = useEditorHistoryContext();

  useEffect(() => {
    addHistoryEvent(model.modelData, {
      type: EditorHistoryType.INITIAL,
      addDate: new Date(),
    });
  }, []);

  const setModelData: UpdateModelData = (
    modelData: ModelData,
    type: EditorHistoryType,
    id?: string
  ) => {
    addHistoryEvent(modelData, {
      type: type,
      itemId: id,
      addDate: new Date(),
      selectedId: selectedId,
      selectedPoint: selectedPoint,
    });
    setModel((prev) => {
      return { ...prev, modelData: modelData };
    });
  };

  const editMode = EditMode({
    dictionary,
    modelData: model.modelData,
    setModelData,
  });
  const resultMode = ResultMode({
    dictionary,
    modelData: model.modelData,
  });

  const contourMode = ContourMode({
    dictionary,
    modelData: model.modelData,
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
              <div className="absolute flex flex-col">
                <div className="flex flex-row">
                  <UndoButton></UndoButton>
                  <RedoButton></RedoButton>
                </div>
                <WireframeButton></WireframeButton>
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
