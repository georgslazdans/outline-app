import { SVGLoader } from "three-stdlib";
import Point from "../data/point/Point";
import ContourPoints from "../data/point/ContourPoints";


// TODO Add support for holes
const toPoints = (svg: string): ContourPoints => {
  const loader = new SVGLoader();
  const data = loader.parse(svg);
  const points: Point[] = [];
  data.paths.map((path) => {
    path.subPaths.map((it) => {
      it.getPoints().forEach((point) => {
        points.push({
          x: point.x,
          y: point.y,
        });
      });
    });
  });
  return { points };
};

export default toPoints