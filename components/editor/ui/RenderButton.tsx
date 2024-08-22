"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import EditorMode from "../mode/EditorMode";
import { useEditorContext } from "../EditorContext";
import Button from "@/components/Button";

type Props = {
  dictionary: Dictionary;
};

const RenderButton = ({ dictionary }: Props) => {
  const { editorMode, setEditorMode, setWireframe, inputFieldFocused } =
    useEditorContext();

  const onFullRenderButton = () => {
    if (editorMode != EditorMode.RESULT) {
      setWireframe(false);
      setEditorMode(EditorMode.RESULT);
    } else {
      setEditorMode(EditorMode.EDIT);
    }
  };

  return (
    <>
      <Button
        className="mt-2"
        onClick={onFullRenderButton}
        hotkey={!inputFieldFocused ? "r" : undefined}
        hotkeyCtrl={!inputFieldFocused ? true : undefined}
      >
        <label>{editorMode == EditorMode.RESULT ? "Edit" : "Render"}</label>
      </Button>
    </>
  );
};

export default RenderButton;
