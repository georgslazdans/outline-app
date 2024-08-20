"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ContourIndex from "./ContourIndex";
import { ModelData } from "@/lib/replicad/Work";
import SelectedPointEdit from "./SelectedPointEdit";
import { ContourPoints } from "@/lib/Point";
import Button from "@/components/Button";
import ScaleAlongNormal from "./ScaleAlongNormal";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  selectedId?: string;
  selectedPoint?: ContourIndex;
  onModelDataChange: (modelData: ModelData) => void;
  onDone: () => void;
};

const ContourModeToolbar = ({
  dictionary,
  modelData,
  selectedId,
  selectedPoint,
  onModelDataChange,
  onDone,
}: Props) => {
  const getSelectedContour = useCallback(() => {
    const selectedItem = modelData.items.find((it) => it.id == selectedId);
    if (selectedItem?.type != "shadow") {
      throw Error("Selected item is not a shadow!");
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
    onModelDataChange({ items: updatedItems });
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

      onContourChanged(updatedPoints);
    }
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
