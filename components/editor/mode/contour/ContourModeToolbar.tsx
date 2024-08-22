"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModelData from "@/lib/replicad/ModelData";
import SelectedPointEdit from "./SelectedPointEdit";
import { ContourPoints } from "@/lib/Point";
import Button from "@/components/Button";
import ScaleAlongNormal from "./ScaleAlongNormal";
import { useEditorContext } from "../../EditorContext";
import EditorMode from "../EditorMode";
import EditorHistoryType from "../../history/EditorHistoryType";
import { UpdateModelData } from "../../EditorComponent";
import { Shadow } from "@/lib/replicad/Model";
import { useEditorHistoryContext } from "../../history/EditorHistoryContext";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const ContourModeToolbar = ({ dictionary, modelData, setModelData }: Props) => {
  const { selectedId, selectedPoint, setSelectedPoint, setEditorMode } =
    useEditorContext();
  const { compressHistoryEvents } = useEditorHistoryContext();

  const getSelectedContour = useCallback(() => {
    const selectedItem = modelData.items.find(
      (it) => it.id == selectedId && it.type == "shadow"
    ) as Shadow;
    if (!selectedItem) {
      throw new Error("Selected item is not found!");
    }
    return selectedItem.points;
  }, [modelData, selectedId]);

  const [selectedContourPoints, setSelectedContourPoints] =
    useState<ContourPoints[]>();

  useEffect(() => {
    setSelectedContourPoints(getSelectedContour);
  }, [getSelectedContour]);

  const onContourChanged = (contourPoints: ContourPoints[]) => {
    setSelectedContourPoints(contourPoints);

    const updatedItems = modelData.items.map((it) => {
      if (it.id == selectedId && it.type == "shadow") {
        return { ...it, points: contourPoints };
      }
      return it;
    });
    setModelData(
      { items: updatedItems },
      EditorHistoryType.CONTOUR_UPDATED,
      selectedId
    );
  };

  const onDeletePoint = () => {
    if (selectedContourPoints && selectedPoint) {
      const updatedPoints = selectedContourPoints.map((contour, index) => {
        if (index === selectedPoint.contour) {
          const updatedContour = {
            points: contour.points.filter(
              (_, pointIndex) => pointIndex !== selectedPoint.point
            ),
          };
          return updatedContour;
        }
        return contour;
      });
      setSelectedPoint(undefined);
      onContourChanged(updatedPoints);
    }
  };

  const onDone = () => {
    compressHistoryEvents(EditorHistoryType.CONTOUR_UPDATED);
    setEditorMode(EditorMode.EDIT);
  };

  return (
    <>
      <Button onClick={onDone}>
        <label>Done</label>
      </Button>
      {selectedContourPoints && (
        <ScaleAlongNormal
          dictionary={dictionary}
          contour={selectedContourPoints}
          onContourChanged={onContourChanged}
        ></ScaleAlongNormal>
      )}
      {selectedContourPoints && selectedPoint && (
        <>
          <Button onClick={onDeletePoint} hotkey="Delete">
            <label>Delete Point</label>
          </Button>
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
