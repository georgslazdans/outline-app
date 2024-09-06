"use client";

import { useRef } from "react";
import ContourIndex from "../../../../../../lib/data/contour/ContourIndex";
import { useEditorContext } from "../../../../EditorContext";
import deepEqual from "@/lib/utils/Objects";
import { Intersection, ThreeEvent } from "@react-three/fiber";
import { PointClickHandler } from "../PointClickContext";

const usePointSelection = (): PointClickHandler => {
  const { selectedPoint, setSelectedPoint } = useEditorContext();
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

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (isEventProcessed(event)) {
      return;
    }
    pointChangedOnDownEvent.current = false;
    const intersectingPoints: ContourIndex[] = uniqueContourIndexesOf(
      event.intersections
    );
    if (selectedPoint) {
      if (!hasSelectedPointIn(intersectingPoints)) {
        pointChangedOnDownEvent.current = true;
        setSelectedPoint(intersectingPoints[0]);
      }
    } else {
      pointChangedOnDownEvent.current = true;
      setSelectedPoint(intersectingPoints[0]);
    }
  };

  const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (isEventProcessed(event)) {
      return;
    }
    if (pointChangedOnDownEvent.current) {
      pointChangedOnDownEvent.current = false;
      return;
    }

    const intersectingPoints = uniqueContourIndexesOf(event.intersections);
    if (selectedPoint) {
      const otherPoint = intersectingPoints.find(
        (it) => !deepEqual(selectedPoint, it)
      );
      if (otherPoint) {
        setSelectedPoint(otherPoint);
      }
    } else {
      setSelectedPoint(intersectingPoints[0]);
    }
  };

  return {
    onPointerDown,
    onPointerUp,
  };
};

export default usePointSelection;
