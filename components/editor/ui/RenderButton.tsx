"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import EditorMode from "../mode/EditorMode";
import { useEditorContext } from "../EditorContext";
import Button from "@/components/Button";
import { Tooltip } from "react-tooltip";

type Props = {
  dictionary: Dictionary;
};

const RenderButton = ({ dictionary }: Props) => {
  const { editorMode, setEditorMode, setWireframe, withHotkey } =
    useEditorContext();

  const onFullRenderButton = () => {
    if (editorMode != EditorMode.RESULT) {
      setWireframe(false);
      setEditorMode(EditorMode.RESULT);
    } else {
      setEditorMode(EditorMode.EDIT);
    }
  };
  const id = "render-button";
  return (
    <>
      <Button
        id={id}
        className="mt-2"
        onClick={onFullRenderButton}
        {...withHotkey("r", true)}
      >
        <label>{editorMode == EditorMode.RESULT ? "Edit" : "Render"}</label>
        <Tooltip anchorSelect={"#" + id} place="top">
          {editorMode == EditorMode.RESULT ? "Edit" : "Render"} (Ctrl + R)
        </Tooltip>
      </Button>
    </>
  );
};

export default RenderButton;
