"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React, { useEffect, useMemo, useState } from "react";
import ContourMesh from "./threejs/ContourMesh";
import { useEditorContext } from "../../EditorContext";
import EditorHistoryType from "../../history/EditorHistoryType";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelDataContext } from "../../ModelDataContext";
import ContourPoints, { modifyContourList } from "@/lib/point/ContourPoints";
import ContourSelection from "./ContourSelection";
import useDebounced from "@/lib/utils/Debounced";
import { POINT_SCALE_THREEJS } from "@/lib/point/Point";

type Props = {
  dictionary: Dictionary;
};

const ContourModeEdit = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { selectedId, selectedPoint } = useEditorContext();

  const selectedItem = useMemo(() => {
    if (selectedId) {
      return forModelData(modelData).findById(selectedId);
    }
  }, [modelData, selectedId]);

  const [scaledContours, setScaledContours] = useState<ContourPoints[]>([]);

  useEffect(() => {
    if (selectedItem?.type == ItemType.Contour) {
      const { scalePoints } = modifyContourList(selectedItem.points);
      setScaledContours(scalePoints(POINT_SCALE_THREEJS));
    }
  }, [modelData, selectedItem]);

  const updateModelData = (contours: ContourPoints[]) => {
    if (selectedItem?.type == ItemType.Contour) {
      const { updateItem } = forModelData(modelData);

      const updatedPoints = modifyContourList(contours).scalePoints(1 / POINT_SCALE_THREEJS);
      setModelData(
        updateItem({
          ...selectedItem,
          points: updatedPoints,
        }),
        EditorHistoryType.CONTOUR_UPDATED,
        selectedItem.id
      );
    }
  };

  const { onChange: debouncedUpdate } = useDebounced(updateModelData);

  const onContourChanged = (contourIndex: number) => {
    return (contour: ContourPoints) => {
      const updatedContours = [...scaledContours];
      updatedContours[contourIndex] = contour;
      debouncedUpdate(updatedContours);
    };
  };

  return (
    <>
      <ContourSelection>
        {scaledContours &&
          scaledContours.map((contour, index) => {
            return (
              <ContourMesh
                key={"ContourMesh" + index}
                contourIndex={index}
                contour={contour}
                onContourChange={onContourChanged(index)}
                selectedPoint={selectedPoint}
              ></ContourMesh>
            );
          })}
      </ContourSelection>
    </>
  );
};

export default ContourModeEdit;
