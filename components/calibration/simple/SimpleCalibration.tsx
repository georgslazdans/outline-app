"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import Settings from "@/lib/opencv/Settings";
import Button from "../../Button";
import { useDetails } from "@/context/DetailsContext";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useCallback } from "react";
import Svg from "@/lib/Svg";
import StepResult from "@/lib/opencv/StepResult";
import { downloadFile } from "@/lib/utils/Download";
import { OutlineImageViewer } from "../OutlineImageViewer";
import StepSetting from "@/lib/opencv/processor/steps/StepSettings";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import { centerPoints } from "@/lib/Point";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  openAdvancedMode: () => void;
  stepResults: StepResult[];
  outlineCheckImage?: ImageData;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  openAdvancedMode,
  stepResults,
  outlineCheckImage,
}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const handleSettingsChange = (updatedSettings: Settings) => {
    if (detailsContext) {
      const newDetails = { ...detailsContext, settings: updatedSettings };
      setDetailsContext(newDetails);
    }
  };

  const exportSvg = useCallback(() => {
    const lastStep = stepResults[stepResults.length - 1];
    const paperDimensions = paperDimensionsOfDetailsContext(detailsContext);
    const contours = lastStep.contours!.map((it) =>
      centerPoints(it, paperDimensions)
    );
    const svg = Svg.from(contours, paperDimensions);
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  }, [detailsContext, stepResults]);

  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row flex-grow">
        <OutlineImageViewer
          className="max-h-[30vh] xl:max-h-[45vh] xl:w-1/2"
          image={outlineCheckImage}
        ></OutlineImageViewer>
        <SimpleSettingsEditor
          dictionary={dictionary}
          settings={settings}
          onChange={handleSettingsChange}
        ></SimpleSettingsEditor>
      </div>

      <div className="flex flex-col mt-4">
        <Button onClick={() => openAdvancedMode()} style="secondary">
          <label>{dictionary.calibration.advancedSettings}</label>
        </Button>
        <Button className="mt-2" onClick={exportSvg} style="secondary">
          <label>{dictionary.calibration.exportSvg}</label>
        </Button>
      </div>
    </>
  );
};

export default SimpleCalibration;
