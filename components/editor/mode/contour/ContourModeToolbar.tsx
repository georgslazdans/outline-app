"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useMemo, useState } from "react";
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
};

const ContourModeToolbar = ({
  dictionary,
  modelData,
  selectedId,
  selectedPoint,
  onModelDataChange,
}: Props) => {
  const getSelectedContour = useCallback(() => {
    const selectedItem = modelData.items.find((it) => it.id == selectedId);
    if (selectedItem?.type != "shadow") {
      throw Error("Selected item is not a shadow!");
    }
    return selectedItem.points;
  }, [modelData.items, selectedId]);

  // Probably need to be upper level?
  const [selectedContourPoints, setSelectedContourPoints] = useState(
    getSelectedContour()
  );

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
      <Button>
        <label>Done</label>
      </Button>
      {selectedPoint && (
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
