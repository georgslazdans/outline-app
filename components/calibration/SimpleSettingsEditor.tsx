import Settings from "@/lib/opencv/Settings";
import InputField from "../InputField";
import { Dictionary } from "@/app/dictionaries";
import { StepSetting } from "@/lib/opencv/steps/ProcessingFunction";
import { ChangeEvent } from "react";
import thresholdFunction from "@/lib/opencv/steps/Threshold";
import blurFunction from "@/lib/opencv/steps/Blur";
import StepName from "@/lib/opencv/steps/StepName";

const threshold = thresholdFunction.name;
const blur = blurFunction.name;

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onChange: (stepName: StepName, stepSettings: StepSetting) => void;
};

const SimpleSettingsEditor = ({ dictionary, settings, onChange }: Props) => {
  const handleOnChange = (stepName: StepName) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSetting = {
        ...settings,
        [event.target.name]: Number.parseInt(event.target.value),
      };
      onChange(stepName, updatedSetting);
    };
  };

  return (
    <div>
      <h2 className="text-center p-2">{dictionary.calibration.settings}</h2>
      <InputField
        label={threshold}
        name={`threshold`}
        value={settings[threshold].threshold}
        onChange={handleOnChange(threshold)}
        type="number"
      />
      <InputField
        className="mt-2"
        label={blur}
        name={`blurWidth`}
        value={settings[blur].blurWidth}
        onChange={handleOnChange(blur)}
        type="number"
      />
    </div>
  );
};

export default SimpleSettingsEditor;
