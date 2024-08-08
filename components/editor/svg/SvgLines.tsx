"use client";

import { ContourPoints } from "@/lib/Point";
import React from "react";
import { Vector3 } from "three";
import { Line } from "@react-three/drei";

type Props = {
  contour: ContourPoints;
};

const SvgLines = ({ contour }: Props) => {
  const vertices = contour.points.map((it) => new Vector3(it.x, it.y, 0));
  return <Line points={vertices} color="black" lineWidth={3}></Line>;
};

export default SvgLines;
