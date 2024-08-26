import { Vector3 } from "three";

type Point = {
  x: number;
  y: number;
};

export const POINT_SCALE_THREEJS = 0.01;

export const scaleVectorOf = (scale: number) => {
  return new Vector3(scale, scale, scale);
};

export default Point;
