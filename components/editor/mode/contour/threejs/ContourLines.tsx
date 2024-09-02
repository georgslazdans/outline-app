"use client";

import React, { memo, } from "react";
import { Intersection, Vector3 } from "three";
import { Line } from "@react-three/drei";
import Point from "@/lib/data/Point";
import { ThreeEvent } from "@react-three/fiber";

type Props = {
  points: Point[];
  onLineDoubleClick: (point: Point, index: number) => void;
};

const hasContourPointClicked = (intersections: Intersection[]) => {
  if (!intersections || intersections.length <= 0) return false;
  const contourPointIntersection = intersections.find(
    (it) => !!it.object.userData.contourIndex
  );
  return !!contourPointIntersection;
};

const ContourLines = memo(function SvgLineMesh({
  points,
  onLineDoubleClick,
}: Props) {
  const vertices = points.map((it) => new Vector3(it.x, it.y, 0));

  const onDoubleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!hasContourPointClicked(event.intersections)) {
      if (event.pointOnLine) {
        const { x, y } = event.pointOnLine;
        onLineDoubleClick({ x, y }, event.faceIndex!);
      } else {
        const { x, y } = event.point;
        onLineDoubleClick({ x, y }, event.faceIndex!);
      }
    }
  };
  return (
    <>
      <Line
        points={[...vertices, vertices[0]]}
        color="#1296b6"
        lineWidth={3.5}
        onDoubleClick={onDoubleClick}
      ></Line>
      <Line
        points={[...vertices, vertices[0]]}
        color="#1296b6"
        visible={false}
        lineWidth={12}
        onDoubleClick={onDoubleClick}
      ></Line>
    </>
  );
});

export default ContourLines;
