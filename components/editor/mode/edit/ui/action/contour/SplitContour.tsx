"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import ContourPoints, {
  modifyContourList,
} from "@/lib/data/contour/ContourPoints";
import React from "react";
import { TRASH_CAN_SVG } from "../../icon/GlobalIcons";
import { usePointClickContext } from "../../../../contour/selection/PointClickContext";
import PointClickMode from "../../../../contour/selection/PointClickMode";
import { useEditorContext } from "@/components/editor/EditorContext";
import { useEditorHistoryContext } from "@/components/editor/history/EditorHistoryContext";
import EditorMode from "@/components/editor/mode/EditorMode";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";

type Props = {
  dictionary: Dictionary;
};

const SplitContour = ({
  dictionary,
}: Props) => {

  const { selectedId, setEditorMode } = useEditorContext();
  const { ensureLastEventHas } = useEditorHistoryContext();

  const { setClickMode } = usePointClickContext();

  const onSplitContour = () => {
    if (selectedId) {
      setEditorMode(EditorMode.CONTOUR_EDIT);
      setClickMode(PointClickMode.SPLIT);
      ensureLastEventHas(selectedId, EditorHistoryType.CONTOUR_UPDATED);
    }
  };

  return (
    <>
      <ActionButton
        dictionary={dictionary}
        id={"split-contour"}
        onClick={onSplitContour}
        // icon={TRASH_CAN_SVG}
        label="Split"
        tooltip="Split contour"
        // {...withHotkey("Delete")}
      ></ActionButton>
    </>
  );
};

export default SplitContour;
