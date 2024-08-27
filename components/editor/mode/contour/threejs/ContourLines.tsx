"use client";

import React, { memo } from "react";
import { Vector3 } from "three";
import { Line } from "@react-three/drei";
import Point from "@/lib/data/point/Point";

type Props = {
  points: Point[];
};

const ContourLines = memo(function SvgLineMesh({ points }: Props) {
  const vertices = points.map((it) => new Vector3(it.x, it.y, 0));
  return (
    <Line
      points={[...vertices, vertices[0]]}
      color="black"
      lineWidth={3}
      depthTest={false}
    ></Line>
  );
});

export default ContourLines;
