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

export const centerPointOf = (pointA: Point, pointB: Point) => {
  const distance = subtract(pointB, pointA);
  return add(pointA, scalar(distance, 1 / 2));
}

export const calculateNormal = (p1: Point, p2: Point): Point => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return { x: -dy / length, y: dx / length };
};

export default Point;
