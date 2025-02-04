"use client";

import React, { useCallback, useMemo } from "react";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import Svg from "@/lib/vector/svg/Svg";
import { Context } from "@/context/DetailsContext";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import Orientation from "@/lib/Orientation";

type Props = {
  contourPoints?: ContourPoints[];
  context?: Context;
};

const ContourPointPreview = ({ contourPoints, context }: Props) => {
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
    Svg.orientationOf(svg) == Orientation.LANDSCAPE ? "w-48" : "w-20";
  return (
    <>
      <div className={`${widthClass} h-32 mx-auto p-2`}>
        <div
          className="w-full h-full flex items-center justify-center text-black dark:text-white"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </>
  );
};

export default ContourPointPreview;
