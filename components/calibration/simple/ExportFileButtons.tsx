"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useDetails } from "@/context/DetailsContext";
import Dxf from "@/lib/export/dxf/Dxf";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import Svg from "@/lib/export/svg/Svg";
import React, { useCallback } from "react";
import { useResultContext } from "../ResultContext";
import StepName from "@/lib/opencv/processor/steps/StepName";
import exportNameOf from "@/lib/utils/ExportName";

type Props = {
  dictionary: Dictionary;
};

const ExportFileButtons = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();
  const { stepResults, outdatedSteps, objectOutlineImages } =
    useResultContext();

  const exportSvg = useCallback(() => {
    const lastStep = stepResults[stepResults.length - 1];
    const paperDimensions = paperDimensionsOfDetailsContext(detailsContext);
    const contourOutlines = lastStep.contours ? lastStep.contours : [];
    const exportName = exportNameOf(detailsContext.details.name);
    Svg.download(contourOutlines, paperDimensions, exportName);
  }, [detailsContext, stepResults]);

  const exportDxf = useCallback(() => {
    const lastStep = stepResults[stepResults.length - 1];
    const contourOutlines = lastStep.contours ? lastStep.contours : [];
    const exportName = exportNameOf(detailsContext.details.name);
    Dxf.download(contourOutlines, exportName);
  }, [detailsContext, stepResults]);

  if (
    outdatedSteps.includes(StepName.FIND_OBJECT_OUTLINES) ||
    objectOutlineImages.length == 0
  ) {
    return null;
  }

  return (
    <>
      <label className="mx-auto xl:mr-4 my-auto mb-2">
        {dictionary.calibration.export}
      </label>
      <div className="flex flex-row gap-4 mx-auto xl:ml-0 mx:mr-2">
        <Button
          size="medium"
          className="w-32"
          onClick={exportSvg}
          style="secondary"
        >
          <label className="cursor-pointer">
            {dictionary.calibration.exportSvg}
          </label>
        </Button>
        <Button
          size="medium"
          className="w-32"
          onClick={exportDxf}
          style="secondary"
        >
          <label className="cursor-pointer">
            {dictionary.calibration.exportDxf}
          </label>
        </Button>
      </div>
    </>
  );
};

export default ExportFileButtons;
