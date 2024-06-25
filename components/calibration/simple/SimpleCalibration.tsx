"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import Settings from "@/lib/opencv/Settings";
import Button from "../../Button";
import { useDetails } from "@/context/DetailsContext";
import StepName from "@/lib/opencv/steps/StepName";
import { useCallback } from "react";
import Svg from "@/lib/Svg";
import StepResult from "@/lib/opencv/StepResult";
import { downloadFile } from "@/lib/utils/Download";
import { OutlineImageViewer } from "../OutlineImageViewer";
import StepSetting from "@/lib/opencv/steps/StepSettings";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  settingsChanged: boolean;
  openAdvancedMode: () => void;
  stepResults: StepResult[];
  outlineCheckImage?: ImageData;
  rerun: () => void;
  onClose: () => void;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  settingsChanged,
  openAdvancedMode,
  stepResults,
  outlineCheckImage,
  rerun,
  onClose: close,
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
    const svg = Svg.from(lastStep.points!);
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  }, [stepResults]);

  return (
    <>
      <OutlineImageViewer image={outlineCheckImage}></OutlineImageViewer>
      <SimpleSettingsEditor
        dictionary={dictionary}
        settings={settings}
        onChange={handleSettingsChange}
      ></SimpleSettingsEditor>
      <div className="flex flex-col mt-4">
        <Button onClick={() => openAdvancedMode()} style="secondary">
          <label>{dictionary.calibration.advancedSettings}</label>
        </Button>
        <Button className="mt-2" onClick={exportSvg} style="secondary">
          <label>{dictionary.calibration.exportSvg}</label>
        </Button>
      </div>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => rerun()}
          style={settingsChanged ? "red" : "disabled"}
        >
          <label>{dictionary.calibration.rerun}</label>
        </Button>
        <Button onClick={() => close()}>
          <label>{dictionary.calibration.done}</label>
        </Button>
      </div>
    </>
  );
};

export default SimpleCalibration;
