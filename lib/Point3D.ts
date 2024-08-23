import { Vector3 } from "three";

type Point3D = {
  x: number;
  y: number;
  z: number;
};

export const toVector = (point: Point3D) => {
  return new Vector3(point.x, point.y, point.z);
};

export const add = (a: Point3D, b: Point3D) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
};

export default Point3D;
