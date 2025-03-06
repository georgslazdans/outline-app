"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import { useEditorHistoryContext } from "@/components/editor/history/EditorHistoryContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import React, { useMemo } from "react";
import EditorMode from "../../EditorMode";
import { usePointClickContext } from "../selection/PointClickContext";
import PointClickMode from "../selection/PointClickMode";
import Contour, { contourItemOf } from "@/lib/replicad/model/item/contour/Contour";
import Item from "@/lib/replicad/model/Item";
import { queryContourList } from "@/lib/data/contour/ContourPoints";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import BooleanOperation from "@/lib/replicad/model/BooleanOperation";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { findById } from "@/lib/replicad/model/ModelData";
import { forModelData } from "@/lib/replicad/model/ForModelData";

type Props = {
  dictionary: Dictionary;
};

const DoneButton = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { clickMode, splitPoints, setSplitPoints } = usePointClickContext();
  const { selectedId, setEditorMode } = useEditorContext();
  const { compressHistoryEvents } = useEditorHistoryContext();

  const selectedContour = useMemo(() => {
    return findById(modelData, selectedId) as Item & Contour;
  }, [modelData, selectedId]);

  const onDone = () => {
    if (clickMode == PointClickMode.SELECTION) {
      compressHistoryEvents(EditorHistoryType.CONTOUR_UPDATED);
    } else if (clickMode == PointClickMode.SPLIT && splitPoints.length > 0) {
      const newContours = queryContourList(
        selectedContour.points
      ).divideContour(splitPoints);
      const contourItems = newContours.map((it, index) => {
        const newName = selectedContour.name + " " + (index + 1);
        const item = contourItemOf(
          it,
          newName,
          selectedContour.height,
          selectedContour.offset,
          selectedContour.detailsContextId
        );
        item.booleanOperation = BooleanOperation.UNION;
        return item;
      });
      const group = itemGroupOf(contourItems, selectedContour.name);
      group.id = selectedContour.id;
      group.translation = selectedContour.translation;
      group.rotation = selectedContour.rotation;

      setModelData(
        forModelData(modelData).updateItem(group),
        EditorHistoryType.OBJ_ADDED,
        selectedContour.id
      );

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
