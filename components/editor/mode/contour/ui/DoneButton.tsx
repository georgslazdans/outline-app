"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import { useEditorHistoryContext } from "@/components/editor/history/EditorHistoryContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import React from "react";
import EditorMode from "../../EditorMode";
import { usePointClickContext } from "../selection/PointClickContext";
import PointClickMode from "../selection/PointClickMode";
import { useModelContext } from "@/context/ModelContext";
import Contour, { contourItemOf } from "@/lib/replicad/model/item/Contour";
import Item from "@/lib/replicad/model/Item";
import { queryContourList } from "@/lib/data/contour/ContourPoints";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import BooleanOperation from "@/lib/replicad/model/BooleanOperation";

type Props = {
  dictionary: Dictionary;
};

const DoneButton = ({ dictionary }: Props) => {
  const { clickMode, splitPoints, setSplitPoints } = usePointClickContext();
  const { selectedId, setEditorMode } = useEditorContext();
  const { compressHistoryEvents } = useEditorHistoryContext();

  const { model, setModel } = useModelContext();

  const selectedContour = () => {
    return model.modelData.items.find((it) => it.id == selectedId) as Item &
      Contour;
  };

  const onDone = () => {
    if (clickMode == PointClickMode.SELECTION) {
      compressHistoryEvents(EditorHistoryType.CONTOUR_UPDATED);
    } else if (clickMode == PointClickMode.SPLIT && splitPoints.length > 0) {
      const contour = selectedContour();
      const newContours = queryContourList(contour.points).divideContour(
        splitPoints
      );
      const contourItems = newContours.map((it, index) => {
        const newName = contour.name + " " + (index + 1);
        const item = contourItemOf(
          it,
          contour.height,
          newName,
          contour.detailsContextId
        );
        item.booleanOperation = BooleanOperation.UNION;
        return item;
      });
      const group = itemGroupOf(contourItems, contour.name);
      group.translation = contour.translation;
      group.rotation = contour.rotation;
      const newItems = model.modelData.items.map((it) => {
        if (it.id == contour.id) {
          return group;
        }
        return it;
      });
      setModel({
        ...model,
        modelData: {
          ...model.modelData,
          items: newItems,
        },
      });
      setSplitPoints([]);
    }
    setEditorMode(EditorMode.EDIT);
  };

  return (
    <Button className="mb-2" onClick={onDone}>
      <label>Done</label>
    </Button>
  );
};

export default DoneButton;
