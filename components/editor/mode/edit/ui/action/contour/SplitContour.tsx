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
    <path d="M 4.8922178,1.3326837 C 4.6350414,1.3328075 4.3888167,1.4758305 4.2069883,1.7305922 4.0281056,1.9825822 4.0867814,1.9523814 3.8814268,2.3693129 H 1.5906105 C 1.4739724,2.2831192 1.3436966,2.2380633 1.2118223,2.2380548 0.76387271,2.2380253 0.40099793,2.7469501 0.40101905,3.3744195 0.40099787,4.0018891 0.76387273,4.5102971 1.2118223,4.5102675 1.4095564,4.5099258 1.600692,4.4086171 1.7487404,4.2250136 h 2.201416 c 0.045938,0.2137581 0.1289289,0.4086368 0.241329,0.5668905 0.378654,0.5308129 0.9930722,0.5309336 1.3720092,5.167e-4 C 5.7604404,4.5165247 5.8632293,4.1353552 5.845648,3.7459731 H 4.9666319 v -0.018087 l 0.043408,-0.9069214 h 0.137976 0.7100342 C 5.8856645,2.417332 5.7831394,2.0173527 5.5784808,1.7305922 5.396527,1.4756547 5.1495717,1.3326174 4.8922178,1.3326837 Z" />
    <path
      strokeDasharray={"0.396875, 0.79375"}
      d="M 1.5793013,0.65061729 1.6421308,5.7704278"
    />
    <path
      strokeDasharray={"0.396875, 0.79375"}
      d="M 3.8757196,0.60778725 3.9385491,5.7275978"
    />
  </svg>
);
const SplitContour = ({ dictionary }: Props) => {
  const { selectedId, setEditorMode, setSelectedPoint } = useEditorContext();
  const { ensureLastEventHas } = useEditorHistoryContext();

  const { setClickMode } = usePointClickContext();

  const onSplitContour = () => {
    if (selectedId) {
      setSelectedPoint(undefined);
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
        icon={icon}
        label="Split"
        tooltip="Split contour"
        // {...withHotkey("Delete")}
      ></ActionButton>
    </>
  );
};

export default SplitContour;
