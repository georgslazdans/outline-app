"use client";

import React, { useCallback, useMemo } from "react";
import Svg from "@/lib/export/svg/Svg";
import {
  centerPoints,
  Context,
  contourOutlineOf,
} from "@/context/DetailsContext";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import Orientation from "@/lib/Orientation";
import { contourPointsOf } from "@/lib/data/contour/ContourPoints";

type Props = {
  context?: Context;
  contourIndex: number;
};

const ContourPointPreview = ({ context, contourIndex }: Props) => {
  const contourPoints = useMemo(() => {
    if (context) {
      const outline = contourOutlineOf(context, contourIndex)
      const points = contourPointsOf(outline);
      return centerPoints(context, points);
    }
  }, [context, contourIndex]);

  const createSvg = useCallback(() => {
    if (context && contourPoints && contourPoints.length != 0) {
      const paperDimensions = paperDimensionsOfDetailsContext(context);
      const rawSvg = Svg.from(contourPoints, paperDimensions);
      return Svg.cropForViewing(rawSvg);
    }
  }, [context, contourPoints]);

  const svg = createSvg();
  if (!svg) {
    return null;
  }
  const widthClass =
    Svg.orientationOf(svg) == Orientation.LANDSCAPE ? "w-64 xl:w-96" : "w-20";
  return (
    <>
      <div className={`${widthClass} h-32 mx-auto p-2`}>
        <div
          className="w-full h-full flex items-center justify-center text-black dark:text-white scale-y-[-1]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </>
  );
};

export default ContourPointPreview;
