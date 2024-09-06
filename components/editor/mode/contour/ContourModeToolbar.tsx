"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useState } from "react";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import SelectedPointEdit from "./ui/SelectedPointEdit";
import { useEditorContext } from "../../EditorContext";
import EditorHistoryType from "../../history/EditorHistoryType";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelDataContext } from "../../ModelDataContext";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import ScaleAlongNormal from "./ui/ScaleAlongNormal";
import AddButtonGroup from "./ui/add";
import ActionButtons from "../../ui/action/ActionButtons";
import DoneButton from "./ui/DoneButton";
import DeleteButtonGroup from "./ui/delete";
import PointClickMode from "./selection/PointClickMode";
import { usePointClickContext } from "./selection/PointClickContext";

type Props = {
  dictionary: Dictionary;
};

const ContourModeToolbar = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { clickMode } = usePointClickContext();

  const { selectedId, selectedPoint } = useEditorContext();

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

  return (
    <>
      <DoneButton dictionary={dictionary}></DoneButton>
      <ActionButtons dictionary={dictionary}>
        {selectedContourPoints && clickMode == PointClickMode.SELECTION && (
          <>
            <ScaleAlongNormal
              dictionary={dictionary}
              contour={selectedContourPoints}
              onContourChanged={onContourChanged}
            ></ScaleAlongNormal>
            <AddButtonGroup
              dictionary={dictionary}
              selectedContour={selectedContourPoints}
              onContourChanged={onContourChanged}
            ></AddButtonGroup>
            <DeleteButtonGroup
              dictionary={dictionary}
              selectedContour={selectedContourPoints}
              onContourChanged={onContourChanged}
            ></DeleteButtonGroup>
          </>
        )}
      </ActionButtons>

      {selectedContourPoints && selectedPoint && (
        <>
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
