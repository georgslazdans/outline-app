"use client";

import React, { memo } from "react";
import { Intersection, Vector3 } from "three";
import { Line } from "@react-three/drei";
import Point from "@/lib/data/Point";

type Props = {
  points: Point[];
  onLineDoubleClick: (point: Point) => void;
};

const ContourLines = memo(function SvgLineMesh({
  points,
  onLineDoubleClick,
}: Props) {
  const vertices = points.map((it) => new Vector3(it.x, it.y, 0));
  const onDoubleClick = (event: any) => {
    const hasContourPointClicked = (intersections: Intersection[]) => {
      if (!intersections || intersections.length <= 0) return false;
      const contourPointIntersection = intersections.find(
        (it) => !!it.object.userData.contourIndex
      );
      return !!contourPointIntersection;
    };
    if (event.point && !hasContourPointClicked(event.intersections)) {
      const { x, y } = event.point;
      onLineDoubleClick({ x, y });
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
