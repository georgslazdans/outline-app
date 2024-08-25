"use client";

import IconButton from "@/components/IconButton";
import React from "react";
import { useEditorHistoryContext } from "../../history/EditorHistoryContext";
import { useEditorContext } from "../../EditorContext";
import { Tooltip } from "react-tooltip";

type Props = {};

const UndoButton = ({}: Props) => {
  const { inputFieldFocused } = useEditorContext();
  const { canUndo, undo } = useEditorHistoryContext();

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7.49 12-3.75 3.75m0 0 3.75 3.75m-3.75-3.75h16.5V4.499"
      />
    </svg>
  );
  const id = "undo-button";
  return (
    <>
      {canUndo() && (
        <IconButton
          id={id}
          className="px-3 py-3 mr-auto mt-2 ml-2"
          onClick={undo}
          hotkey={!inputFieldFocused ? "z" : undefined}
          hotkeyCtrl={!inputFieldFocused ? true : undefined}
        >
          {icon}
          <Tooltip anchorSelect={"#" + id} place="top">
            Undo (Ctrl + Z)
          </Tooltip>
        </IconButton>
      )}
    </>
  );
};

export default UndoButton;
