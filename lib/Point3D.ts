import { Euler, Quaternion, Vector3 } from "three";
import { toDegrees, toRadians } from "./utils/Math";

type Point3D = {
  x: number;
  y: number;
  z: number;
};

export const zeroPoint = () => {
  return { x: 0, y: 0, z: 0 };
};

export const toVector3 = (point: Point3D): Vector3 => {
  return new Vector3(point.x, point.y, point.z);
};

export const fromVector3 = (point: Vector3): Point3D => {
  const { x, y, z } = point;
  return { x, y, z };
};

export const toEuler = (rotation: Point3D): Euler => {
  const { x, y, z } = rotation;
  return new Euler(toRadians(x), toRadians(y), toRadians(z));
};

export const fromEuler = (euler: Euler): Point3D => {
  return {
    x: toDegrees(euler.x),
    y: toDegrees(euler.y),
    z: toDegrees(euler.z),
  };
};

export const add = (a: Point3D, b: Point3D) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
};

export const subtract = (a: Point3D, b: Point3D) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
};

export const addPoints = (points: Point3D[]): Point3D => {
  return points.reduce((acc, curr) => add(acc, curr), { x: 0, y: 0, z: 0 });
};

const asQuaternion = (a: Point3D, b: Point3D) => {
  const aQ = new Quaternion().setFromEuler(toEuler(a));
  const bQ = new Quaternion().setFromEuler(toEuler(a));
  return {
    do: (func: (a: Quaternion, b: Quaternion) => void) => {
      func(aQ, bQ);
    },
  };
};

export const addRotation = (a: Point3D, b: Point3D): Point3D => {
  let result = new Euler();
  asQuaternion(a, b).do((aQ, bQ) => {
    result.setFromQuaternion(aQ.multiply(bQ));
  });
  return fromEuler(result);
};

export const subtractRotation = (a: Point3D, b: Point3D): Point3D => {
  let result = new Euler();
  asQuaternion(a, b).do((aQ, bQ) => {
    result.setFromQuaternion(aQ.multiply(bQ.invert()));
  });
  return fromEuler(result);
};

export default Point3D;
