import ContourPoints from "@/lib/data/contour/ContourPoints";
import Point from "@/lib/data/Point";
import { DxfWriter, LWPolylineFlags, point2d, Units } from "@tarikjabiri/dxf";

const fromContours = (contours: ContourPoints[]): string => {
  const dxf = new DxfWriter();
  dxf.setUnits(Units.Millimeters);
  contours.forEach(({ points }) => {
    dxf.addLWPolyline(asVertices(points), {
      flags: LWPolylineFlags.Closed,
    });
  });
  return dxf.stringify();
};

const asVertices = (points: Point[]) => {
  return points.map((it) => {
    return {
      point: point2d(it.x, it.y),
    };
  });
};

export default fromContours;
