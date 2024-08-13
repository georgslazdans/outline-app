import { Vector3 } from "three";

type Point3D = {
  x: number;
  y: number;
  z: number;
};

export const toVector = (point: Point3D) => {
  return new Vector3(point.x, point.y, point.z);
};

export default Point3D;
