"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React from "react";
import EditorMode from "../../../../EditorMode";
import ActionButton from "../../../../../ui/action/ActionButton";
import { useEditorHistoryContext } from "@/components/editor/history/EditorHistoryContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { usePointClickContext } from "@/components/editor/mode/contour/selection/PointClickContext";
import PointClickMode from "@/components/editor/mode/contour/selection/PointClickMode";

type Props = {
  dictionary: Dictionary;
};

const icon = (
  <svg
    viewBox="0 -1 6.35 5.35"
    version="1.1"
    id="svg1"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    strokeWidth={0.4}
    stroke="currentColor"
  >
    <path
      strokeDasharray="0.5, 0.5"
      strokeDashoffset="2.25"
      d="M 5.0508545,0.70279948 C 4.7936781,0.70292329 4.5474534,0.84594624 4.365625,1.100708 4.1867423,1.352698 4.2454181,1.3224972 4.0400635,1.7394287 H 1.7492472 C 1.6326091,1.653235 1.5023333,1.6081791 1.370459,1.6081706 0.92250942,1.6081411 0.55963464,2.1170659 0.55965576,2.7445353 0.55963458,3.3720049 0.92250944,3.8804129 1.370459,3.8803833 1.5681931,3.8800416 1.7593287,3.7787329 1.9073771,3.5951294 h 2.201416 c 0.045938,0.2137581 0.1289289,0.4086368 0.241329,0.5668905 0.378654,0.5308129 0.9930722,0.5309336 1.3720092,5.167e-4 C 5.9190771,3.8866405 6.021866,3.505471 6.0042847,3.1160889 H 5.1252686 V 3.0980021 L 5.1686768,2.1910807 H 5.3066528 6.016687 C 6.0443012,1.7874478 5.9417761,1.3874685 5.7371175,1.100708 5.5551637,0.84577042 5.3082084,0.70273314 5.0508545,0.70279948 Z"
      id="path10"
    />
  </svg>
);

const EditContour = ({ dictionary }: Props) => {
  const { selectedId, setEditorMode } = useEditorContext();
  const { ensureLastEventHas } = useEditorHistoryContext();
  const { setClickMode } = usePointClickContext();

  const openContourEditMode = () => {
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
        id={"edit-contour-button"}
        onClick={openContourEditMode}
        icon={icon}
        label="Edit"
        tooltip="Edit Contour"
      ></ActionButton>
    </>
  );
};

export default EditContour;
