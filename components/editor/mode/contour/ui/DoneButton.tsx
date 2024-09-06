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
import Contour from "@/lib/replicad/model/item/Contour";
import Item from "@/lib/replicad/model/Item";
import ContourPoints, {
  queryContourList,
} from "@/lib/data/contour/ContourPoints";
import SplitPoints from "../selection/SplitPoints";
import Point from "@/lib/data/Point";

type Props = {
  dictionary: Dictionary;
};

const divideContour = (
  contour: ContourPoints[],
  splitPoints: SplitPoints[]
): ContourPoints[][] => {
  const getSegment = (
    startIndex: number,
    endIndex: number,
    points: Point[]
  ): Point[] => {
    if (startIndex <= endIndex) {
      return points.slice(startIndex, endIndex + 1);
    } else {
      return [...points.slice(startIndex), ...points.slice(0, endIndex + 1)];
    }
  };

  const result: ContourPoints[] = [];
  const processedIndexes: number[] = [];
  const outline = queryContourList(contour).findLargestContourOf();

  const addSegment = (startIndex: number, endIndex: number) => {
    const segment = getSegment(startIndex, endIndex, outline.points);
    result.push({ points: segment });
    segment.forEach((_, index) => processedIndexes.push(index));
  };

  splitPoints.forEach((it) => {
    const { a, b } = it;
    addSegment(a.point, b.point);
    addSegment(b.point, a.point);
  });

  return [];
};

const DoneButton = ({ dictionary }: Props) => {
  const { clickMode, splitPoints, setSplitPoints } = usePointClickContext();
  const { selectedId, setEditorMode } = useEditorContext();
  const { compressHistoryEvents } = useEditorHistoryContext();

  const { model } = useModelContext();

  const selectedContour = () => {
    return model.modelData.items.find((it) => it.id == selectedId) as Item &
      Contour;
  };

  const onDone = () => {
    if (clickMode == PointClickMode.SELECTION) {
      compressHistoryEvents(EditorHistoryType.CONTOUR_UPDATED);
    } else if (clickMode == PointClickMode.SPLIT) {
      const contour = selectedContour();
      // Create a group
      // Add separate items
      setSplitPoints([]);
      // TODO split contour
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
