"use client";

import React, { memo } from "react";
import { Vector3 } from "three";
import { Line } from "@react-three/drei";
import ContourPoints from "@/lib/point/ContourPoints";

type Props = {
  contour: ContourPoints;
};

const SvgLines = memo(function SvgLineMesh({ contour }: Props) {
  const vertices = contour.points.map((it) => new Vector3(it.x, it.y, 0));
  return <Line points={[...vertices, vertices[0]]} color="black" lineWidth={3}></Line>;
});

export default SvgLines;
