"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useState } from "react";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import SelectedPointEdit from "./ui/SelectedPointEdit";
import Button from "@/components/Button";
import { useEditorContext } from "../../EditorContext";
import EditorMode from "../EditorMode";
import EditorHistoryType from "../../history/EditorHistoryType";
import { useEditorHistoryContext } from "../../history/EditorHistoryContext";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelDataContext } from "../../ModelDataContext";
import ContourPoints from "@/lib/point/ContourPoints";
import ScaleAlongNormal from "./ui/ScaleAlongNormal";
import DeletePoint from "./ui/DeletePoint";

type Props = {
  dictionary: Dictionary;
};

const ContourModeToolbar = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { selectedId, selectedPoint, setEditorMode } = useEditorContext();
  const { compressHistoryEvents } = useEditorHistoryContext();

  const getSelectedContour = useCallback(() => {
    if (selectedId) {
      const selectedItem = forModelData(modelData).getById(selectedId);
      if (!selectedItem || selectedItem.type != ItemType.Contour) {
        throw new Error("Selected item is not found!");
      }
      return selectedItem.points;
    }
  }, [modelData, selectedId]);

  const [selectedContourPoints, setSelectedContourPoints] =
    useState<ContourPoints[]>();

  useEffect(() => {
    setSelectedContourPoints(getSelectedContour);
  }, [getSelectedContour]);

  const onContourChanged = (contourPoints: ContourPoints[]) => {
    setSelectedContourPoints(contourPoints);
    if (selectedId) {
      const item = forModelData(modelData).getById(selectedId);
      if (item && item.type == ItemType.Contour) {
        const updatedData = forModelData(modelData).updateItem({
          ...item,
          points: contourPoints,
        });
        setModelData(
          updatedData,
          EditorHistoryType.CONTOUR_UPDATED,
          selectedId
        );
      } else {
        throw new Error("Selected item not found: " + selectedId);
      }
    }
  };

  const onDone = () => {
    compressHistoryEvents(EditorHistoryType.CONTOUR_UPDATED);
    setEditorMode(EditorMode.EDIT);
  };

  return (
    <>
      <Button className="mb-2" onClick={onDone}>
        <label>Done</label>
      </Button>
      {selectedContourPoints && (
        <div className="mb-2">
          <ScaleAlongNormal
            dictionary={dictionary}
            contour={selectedContourPoints}
            onContourChanged={onContourChanged}
          ></ScaleAlongNormal>
        </div>
      )}
      {selectedContourPoints && selectedPoint && (
        <>
          <DeletePoint
            dictionary={dictionary}
            selectedContour={selectedContourPoints}
            onContourChanged={onContourChanged}
          ></DeletePoint>
          <SelectedPointEdit
            dictionary={dictionary}
            contourPoints={selectedContourPoints}
            selectedPoint={selectedPoint}
            onPointChanged={onContourChanged}
          ></SelectedPointEdit>
        </>
      )}
    </>
  );
};

export default ContourModeToolbar;
