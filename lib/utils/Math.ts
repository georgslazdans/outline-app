import { Euler, Quaternion, Vector3 } from "three";
import Point3D from "../Point3D";

export const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export const eulerToAxisAngle = (
  rotation: Point3D
): { axis: Point3D; angle: number } => {
  const { x, y, z } = rotation;
  const euler = new Euler(toRadians(x), toRadians(y), toRadians(z), "XYZ");

  // Convert the Euler angles to a Quaternion
  const quaternion = new Quaternion().setFromEuler(euler);

  // Extract the axis and angle from the Quaternion
  const axis = new Vector3(0, 0, 0);
  const angle = 2 * Math.acos(quaternion.w); // angle = 2 * arccos(w)

  // Calculate the axis (x, y, z components)
  const s = Math.sqrt(1 - quaternion.w * quaternion.w); // s = sqrt(1 - w^2)
  if (s < 0.001) {
    // Check to avoid division by zero
    axis.set(1, 0, 0); // Arbitrary axis
  } else {
    axis.set(quaternion.x / s, quaternion.y / s, quaternion.z / s);
  }
  const resultingAxis = { x: axis.x, y: axis.y, z: axis.z };
  return { axis: resultingAxis, angle };
};
