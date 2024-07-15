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

  const handleSettingsChange = (
    stepName: StepName,
    stepSetting: StepSetting
  ) => {
    const saveSettings = (settings: Settings) => {
      const newDetails = { ...detailsContext, settings: settings };
      setDetailsContext(newDetails);
    };

    if (detailsContext) {
      const updatedSettings = {
        ...detailsContext.settings,
        [stepName]: stepSetting,
      };
      saveSettings(updatedSettings);
    }
  };

  const exportSvg = useCallback(() => {
    const lastStep = stepResults[stepResults.length - 1];
    const paperDimensions = paperDimensionsOfDetailsContext(detailsContext);
    const svg = Svg.from(lastStep.contours!, paperDimensions);
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  }, [detailsContext, stepResults]);

  return (
    <>
      <div className="flex flex-col xl:flex-row flex-grow">
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
