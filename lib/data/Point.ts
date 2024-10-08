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
};

export const magnitudeOf = (p: Point) => {
  return Math.sqrt(p.x * p.x + p.y * p.y);
};

export const forPoints = (a: Point, b: Point) => {
  return {
    getMagnitudeDistanceTo: (point: Point): number => {
      const distance = add(subtract(a, point), subtract(b, point));
      return magnitudeOf(distance);
    },
  };
};

export const lengthOf = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const normalOf = (p1: Point, p2: Point): Point => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = lengthOf(p1, p2);
  return { x: -dy / length, y: dx / length };
};

export const minMaxValues = (points: Point[]) => {
  let minX = points[0].x,
    minY = points[0].y,
    maxX = points[0].x,
    maxY = points[0].y;

  points.forEach((point, index) => {
    if (index == 0) return;
    if (minX > point.x) {
      minX = point.x;
    }
    if (maxX < point.x) {
      maxX = point.x;
    }
    if (minY > point.y) {
      minY = point.y;
    }
    if (maxY < point.y) {
      maxY = point.y;
    }
  });
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

export default Point;
