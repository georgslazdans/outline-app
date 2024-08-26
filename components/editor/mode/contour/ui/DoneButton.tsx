"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import { useEditorHistoryContext } from "@/components/editor/history/EditorHistoryContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import React from "react";
import EditorMode from "../../EditorMode";

type Props = {
  dictionary: Dictionary;
};

const DoneButton = ({ dictionary }: Props) => {
  const { setEditorMode } = useEditorContext();
  const { compressHistoryEvents } = useEditorHistoryContext();

  const onDone = () => {
    compressHistoryEvents(EditorHistoryType.CONTOUR_UPDATED);
    setEditorMode(EditorMode.EDIT);
  };

  return (
    <Button className="mb-2" onClick={onDone}>
      <label>Done</label>
    </Button>
  );
};

export default DoneButton;
