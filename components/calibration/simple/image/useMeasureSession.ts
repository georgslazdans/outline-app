import { useEffect, useMemo, useState } from "react";
import Point, { lengthOf } from "@/lib/data/Point";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { Dictionary } from "@/app/dictionaries";
import { useResultContext } from "../../ResultContext";
import { useDetails } from "@/context/DetailsContext";
import { applyDefaults, defaultSettings } from "@/lib/opencv/Settings";
import { pxPerMmFor } from "@/lib/measure/PaperScale";
import {
  distancePx,
  formatMeasurementForDisplay,
} from "@/lib/measure/Measure";

const isSamePoint = (a: Point, b: Point) => lengthOf(a, b) < 1;

export const useMeasureSession = (
  contours: ContourPoints[],
  dictionary: Dictionary
) => {
  const [pointA, setPointA] = useState<Point | undefined>();
  const [pointB, setPointB] = useState<Point | undefined>();
  const { stepResults } = useResultContext();
  const { detailsContext } = useDetails();

  useEffect(() => {
    setPointA(undefined);
    setPointB(undefined);
  }, [contours]);

  const pick = (point: Point) => {
    if (!pointA) {
      setPointA(point);
    } else if (!pointB) {
      if (!isSamePoint(point, pointA)) {
        setPointB(point);
      }
    } else {
      setPointA(point);
      setPointB(undefined);
    }
  };

  const pxPerMm = useMemo(
    () =>
      pxPerMmFor({
        stepResults,
        settings: applyDefaults(defaultSettings(), detailsContext.settings),
      }),
    [stepResults, detailsContext.settings]
  );

  const measurement =
    pointA && pointB
      ? formatMeasurementForDisplay(distancePx(pointA, pointB), pxPerMm)
      : undefined;

  const hint =
    pointA && !pointB
      ? dictionary.calibration.measure.pickSecond
      : dictionary.calibration.measure.pickFirst;

  return { pointA, pointB, pick, measurement, hint };
};
