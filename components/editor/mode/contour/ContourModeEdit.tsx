"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React, { useEffect, useMemo, useState } from "react";
import ContourMesh from "./threejs/ContourMesh";
import { useEditorContext } from "../../EditorContext";
import EditorHistoryType from "../../history/EditorHistoryType";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelDataContext } from "../../ModelDataContext";
import ContourPoints, {
  modifyContourList,
} from "@/lib/data/contour/ContourPoints";
import useDebounced from "@/lib/utils/Debounced";
import { POINT_SCALE_THREEJS } from "@/lib/data/Point";
import BackgroundImage from "./threejs/BackgroundImage";
import SplitPointsLine from "./threejs/SplitPointsLine";
import { usePointClickContext } from "./selection/PointClickContext";

type Props = {
  dictionary: Dictionary;
};

const ContourModeEdit = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { selectedId, wireframe } = useEditorContext();
  const { splitPoints } = usePointClickContext();

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

      const updatedPoints = modifyContourList(contours).scalePoints(
        1 / POINT_SCALE_THREEJS
      );
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

  const { onChange: debouncedUpdate, flush: flushPendingDataChanges } =
    useDebounced(updateModelData);

  const onContourChanged = (contourIndex: number, flush?: boolean) => {
    return (contour: ContourPoints) => {
      const updatedContours = [...scaledContours];
      updatedContours[contourIndex] = contour;
      if (!flush) {
        debouncedUpdate(updatedContours);
      } else {
        updateModelData(updatedContours);
      }
    };
  };

  const getDetailsContext = () => {
    if (selectedItem?.type == ItemType.Contour) {
      return selectedItem.detailsContextId;
    }
  };

  const getOffset = () => {
    if (selectedItem?.type == ItemType.Contour) {
      return selectedItem.offset;
    }
  };

  return (
    <>
      {getDetailsContext() && (
        <BackgroundImage
          detailsContextId={getDetailsContext()!}
          offset={getOffset()}
        ></BackgroundImage>
      )}

      {scaledContours &&
        scaledContours.map((contour, index) => {
          return (
            <ContourMesh
              key={"ContourMesh" + index}
              contourIndex={index}
              contour={contour}
              onContourChange={onContourChanged(index)}
              transparent={wireframe}
              onModelEditEnd={flushPendingDataChanges}
            ></ContourMesh>
          );
        })}

      {scaledContours && (
        <SplitPointsLine
          contour={scaledContours}
          splitPoints={splitPoints}
        ></SplitPointsLine>
      )}
    </>
  );
};

export default ContourModeEdit;
