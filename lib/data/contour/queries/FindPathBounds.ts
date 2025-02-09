import ContourPoints from "../ContourPoints";

type PathBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const _findPathBounds = (contour: ContourPoints) => {
  return (): PathBounds => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < contour.points.length; i++) {
      const { x, y } = contour.points[i];
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  };
};

export default _findPathBounds;
