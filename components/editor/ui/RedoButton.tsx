"use client";

import IconButton from "@/components/IconButton";
import React from "react";
import { useEditorHistoryContext } from "../EditorHistoryContext";
import { useEditorContext } from "../EditorContext";

type Props = {};

const RedoButton = ({}: Props) => {
  const { inputFieldFocused } = useEditorContext();
  const { canRedo, redo } = useEditorHistoryContext();

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
        d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
      />
    </svg>
  );

  return (
    <>
      {canRedo() && (
        <IconButton
          className="px-3 py-3 mr-auto mt-2 ml-2"
          onClick={redo}
          hotkey={!inputFieldFocused ? "y" : undefined}
          hotkeyCtrl={!inputFieldFocused ? true : undefined}
        >
          {icon}
        </IconButton>
      )}
    </>
  );
};

export default RedoButton;
