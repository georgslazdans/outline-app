"use client";

import { useMemo, useRef } from "react";
import ContourIndex from "../../../../../../lib/data/contour/ContourIndex";
import { useEditorContext } from "../../../../EditorContext";
import deepEqual from "@/lib/utils/Objects";
import { Intersection, ThreeEvent } from "@react-three/fiber";
import { PointClickHandler } from "../PointClickContext";
import SplitPoints from "../SplitPoints";
import Contour from "@/lib/replicad/model/item/Contour";
import Item from "@/lib/replicad/model/Item";
import { queryContourList } from "@/lib/data/contour/ContourPoints";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { findById } from "@/lib/replicad/model/ModelData";

type Props = {
  splitPoints: SplitPoints[];
  setSplitPoints: React.Dispatch<React.SetStateAction<SplitPoints[]>>;
};

// TODO lastTimestamp could be a separate hook?
// TODO uniqueContourIndexesOf duplicated across handlers

const useContourSplitting = ({
  splitPoints,
  setSplitPoints,
}: Props): PointClickHandler => {
  const { selectedPoint, setSelectedPoint, selectedId } = useEditorContext();
  const { modelData } = useModelDataContext();
  const lastTimestamp = useRef<number>();
  const pointChangedOnDownEvent = useRef<boolean>(false);

  const uniqueContourIndexesOf = (
    intersections: Intersection[]
  ): ContourIndex[] => {
    return intersections
      .filter((it: any) => !!it.object?.userData?.contourIndex)
      .map((it: any) => it.object?.userData?.contourIndex)
      .filter((value: ContourIndex, index: number, self: ContourIndex[]) => {
        return self.indexOf(value) === index;
      });
  };

  const hasSelectedPointIn = (indexes: ContourIndex[]): boolean => {
    if (indexes.length > 0) {
      const currentPointInIntersection = indexes.find((it) =>
        deepEqual(selectedPoint, it)
      );
      return !!currentPointInIntersection;
    }
    return false;
  };

  const isEventProcessed = (event: ThreeEvent<PointerEvent>): boolean => {
    if (lastTimestamp.current && lastTimestamp.current == event.timeStamp) {
      return true;
    }
    lastTimestamp.current = event.timeStamp;
    return false;
  };

  const selectedContour = useMemo(() => {
    return findById(modelData, selectedId) as Item & Contour;
  }, [modelData, selectedId]);

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (isEventProcessed(event)) {
      return;
    }
    pointChangedOnDownEvent.current = false;

    const intersectingPoints: ContourIndex[] = uniqueContourIndexesOf(
      event.intersections
    );
    const newPoint = intersectingPoints[0];

    if (selectedPoint) {
      if (!hasSelectedPointIn(intersectingPoints)) {
        const { isValidSplitPoint } = queryContourList(selectedContour.points);
        if (isValidSplitPoint(selectedPoint, newPoint, splitPoints)) {
          if (selectedPoint.point < newPoint.point) {
            setSplitPoints((prev: SplitPoints[]) => {
              return [
                ...prev,
                {
                  a: selectedPoint,
                  b: newPoint,
                },
              ];
            });
          } else {
            setSplitPoints((prev: SplitPoints[]) => {
              return [
                ...prev,
                {
                  a: newPoint,
                  b: selectedPoint,
                },
              ];
            });
          }
        }
      }
      setSelectedPoint(undefined);
    } else {
      setSelectedPoint(newPoint);
    }
  };

  const onPointerUp = (event: ThreeEvent<PointerEvent>) => {};

  return {
    onPointerDown,
    onPointerUp,
  };
};

export default useContourSplitting;
