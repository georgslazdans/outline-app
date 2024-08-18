"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ContourIndex from "./ContourIndex";
import { ModelData } from "@/lib/replicad/Work";
import SelectedPointEdit from "./SelectedPointEdit";
import { ContourPoints } from "@/lib/Point";
import Button from "@/components/Button";

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
  onDone
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

  const onPointChanged = (contourPoints: ContourPoints[]) => {
    setSelectedContourPoints(contourPoints);

    const updatedItems = modelData.items.map((it) => {
      if (it.id == selectedId && it.type == "shadow") {
        return { ...it, points: contourPoints };
      }
      return it;
    });
    onModelDataChange({ items: updatedItems });
  };

  return (
    <>
      <Button onClick={onDone}>
        <label>Done</label>
      </Button>
      {selectedContourPoints && selectedPoint && (
        <SelectedPointEdit
          dictionary={dictionary}
          contourPoints={selectedContourPoints}
          selectedPoint={selectedPoint}
          onPointChanged={onPointChanged}
        ></SelectedPointEdit>
      )}
    </>
  );
};

export default ContourModeToolbar;
