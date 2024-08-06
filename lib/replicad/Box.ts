import { drawRoundedRectangle } from "replicad";

const drawBox = (thickness: number) => {
  return drawRoundedRectangle(30, 50)
    .sketchOnPlane()
    .extrude(20)
    .shell(thickness, (f) => f.inPlane("XY", 20));
};

export default drawBox;
