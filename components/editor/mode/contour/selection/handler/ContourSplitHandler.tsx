"use client";

import { useRef } from "react";
import ContourIndex, {
  pointByIndex,
} from "../../../../../../lib/data/contour/ContourIndex";
import { useEditorContext } from "../../../../EditorContext";
import deepEqual from "@/lib/utils/Objects";
import { Intersection, ThreeEvent } from "@react-three/fiber";
import { PointClickHandler } from "../PointClickContext";
import SplitPoints from "../SplitPoints";
import Contour from "@/lib/replicad/model/item/Contour";
import { useModelContext } from "@/context/ModelContext";
import ItemType from "@/lib/replicad/model/ItemType";
import Item from "@/lib/replicad/model/Item";
import { toLineSegments } from "@/lib/data/line/LineSegment";
import { findIntersectingSegments } from "@/lib/data/line/LineIntersection";
import { queryContourList } from "@/lib/data/contour/ContourPoints";

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
  const { model } = useModelContext();
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

  const selectedContour = () => {
    return model.modelData.items.find(
      (it) => it.id == selectedId && it.type == ItemType.Contour
    ) as Item & Contour;
  };

  const intersectsWithExistingLines = (
    a: ContourIndex,
    b: ContourIndex
  ): boolean => {
    const contour = selectedContour();

    const pointA = pointByIndex(contour.points, a);
    const pointB = pointByIndex(contour.points, b);
    const segments = toLineSegments([pointA, pointB]);
    const existingSegments = splitPoints.map((it) => {
      return toLineSegments([
        pointByIndex(contour.points, it.a),
        pointByIndex(contour.points, it.b),
      ]);
    });

    const intersecting = existingSegments.find(
      (it) => findIntersectingSegments([...segments, ...it]).length > 0
    );
    const result = !!intersecting && intersecting.length > 0;
    return result;
  };

  const intersectsWithHoles = (a: ContourIndex, b: ContourIndex): boolean => {
    const contour = selectedContour();
    const largestContour = queryContourList(
      contour.points
    ).findLargestContourOf();
    const holes = contour.points.filter((it) => it != largestContour);

    const pointA = pointByIndex(contour.points, a);
    const pointB = pointByIndex(contour.points, b);
    const segments = toLineSegments([pointA, pointB]);

    const intersecting = holes
      .map((it) => toLineSegments(it.points))
      .find((it) => findIntersectingSegments([...segments, ...it]).length > 0);
    const result = !!intersecting && intersecting.length > 0;
    return result;
  };

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
        // TODO don't allow splitting in hole
        // TODO don't allow splitting on the contour line!
        if (
          !intersectsWithExistingLines(selectedPoint, newPoint) &&
          !intersectsWithHoles(selectedPoint, newPoint)
        ) {
          setSplitPoints((prev: SplitPoints[]) => {
            return [
              ...prev,
              {
                a: selectedPoint,
                b: newPoint,
              },
            ];
          });
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
