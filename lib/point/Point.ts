import { Vector3 } from "three";

type Point = {
  x: number;
  y: number;
};

export const POINT_SCALE_THREEJS = 0.01;

export const scaleVectorOf = (scale: number) => {
  return new Vector3(scale, scale, scale);
};

export const add = (a: Point, b: Point) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};

export const subtract = (a: Point, b: Point) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

export const scalar = (a: Point, scalar: number) => {
  return {
    x: a.x * scalar,
    y: a.y * scalar,
  };
};

export default Point;
