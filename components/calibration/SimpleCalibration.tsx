"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import { StepSetting } from "@/lib/opencv/steps/ProcessingFunction";
import Settings from "@/lib/opencv/Settings";
import Button from "../Button";
import { useDetails } from "@/context/DetailsContext";
import StepName from "@/lib/opencv/steps/StepName";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  openAdvancedMode: () => void;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  openAdvancedMode,
}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const handleSettingsChange = (stepName: StepName, stepSetting: StepSetting) => {
    const saveSettings = (settings: Settings) => {
      const newDetails = { ...detailsContext, settings: settings };
      setDetailsContext(newDetails);
    };

    if(detailsContext) {
      const updatedSettings = {
        ...detailsContext.settings,
        [stepName]: stepSetting,
      };
      saveSettings(updatedSettings);
    }
  };

  return (
    <>
      <SimpleSettingsEditor
        dictionary={dictionary}
        settings={settings}
        onChange={handleSettingsChange}
      ></SimpleSettingsEditor>
      <div className="flex flex-col mt-4">
        <Button onClick={() => openAdvancedMode()}>
          <label>{dictionary.calibration.advancedSettings}</label>
        </Button>
        <Button className="mt-2" onClick={() => {}}>
          <label>{dictionary.calibration.exportSvg}</label>
        </Button>
      </div>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => {}}>
          <label>{dictionary.calibration.done}</label>
        </Button>
      </div>
    </>
  );
};

export default SimpleCalibration;
