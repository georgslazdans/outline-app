"use client";

import React, { useMemo } from "react";
import SplitPoints from "../selection/SplitPoints";
import { Line } from "@react-three/drei";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { ThreeEvent } from "@react-three/fiber";
import { usePointClickContext } from "../selection/PointClickContext";
import deepEqual from "@/lib/utils/Objects";

type Props = {
  contour: ContourPoints[];
  splitPoints: SplitPoints[];
};

type SplitSegment = {
  points: [number, number][];
  indexes: SplitPoints;
};

const SplitPointsLine = ({ contour, splitPoints }: Props) => {
  const { setSplitPoints } = usePointClickContext();

  const segments: SplitSegment[] = useMemo(() => {
    return splitPoints.map((it) => {
      const { a, b } = it;
      const pointA = contour[a.contour].points[a.point];
      const pointB = contour[b.contour].points[b.point];
      return {
        points: [
          [pointA.x, pointA.y],
          [pointB.x, pointB.y],
        ],
        indexes: it,
      };
    });
  }, [contour, splitPoints]);

  const onDoubleClick = (indexes: SplitPoints) => {
    return (event: ThreeEvent<MouseEvent>) => {
      setSplitPoints((prev) => {
        return prev.filter((it) => {
          return !deepEqual(it, indexes);
        });
      });
    };
  };

  return (
    <>
      {segments.map((it, index) => {
        return (
          <>
            <group key={index}>
              <Line
                points={it.points}
                color={"#DA4167"}
                lineWidth={3.5}
                onDoubleClick={onDoubleClick(it.indexes)}
              ></Line>
              <Line
                points={it.points}
                visible={false}
                lineWidth={12}
                onDoubleClick={onDoubleClick(it.indexes)}
              ></Line>
            </group>
          </>
        );
      })}
    </>
  );
};

export default SplitPointsLine;
