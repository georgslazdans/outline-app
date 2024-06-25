import Settings from "@/lib/opencv/Settings";
import { Dictionary } from "@/app/dictionaries";
import { ChangeEvent } from "react";
import thresholdStep from "@/lib/opencv/processor/steps/Threshold";
import blurStep from "@/lib/opencv/processor/steps/Blur";
import StepName from "@/lib/opencv/processor/steps/StepName";
import NumberField from "../../fiields/NumberField";
import StepSetting from "@/lib/opencv/processor/steps/StepSettings";

const threshold = thresholdStep.name;
const blur = blurStep.name;

type Props = {
  dictionary: Dictionary;
  settings?: Settings;
  onChange: (stepName: StepName, stepSettings: StepSetting) => void;
};

const SimpleSettingsEditor = ({ dictionary, settings, onChange }: Props) => {
  const handleOnChange = (stepName: StepName) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSetting = {
        ...settings![stepName],
        [event.target.name]: Number.parseInt(event.target.value),
      };
      onChange(stepName, updatedSetting);
    };
  };

  if (!settings) {
    return <></>;
  }

  return (
    <div>
      <h2 className="text-center p-2">{dictionary.calibration.settings}</h2>
      <NumberField
        label={dictionary.calibration.stepSettings.threshold}
        name={`threshold`}
        value={settings[threshold].threshold}
        onChange={handleOnChange(threshold)}
        slider
      />
      <NumberField
        className="mt-2"
        label={dictionary.calibration.stepSettings.blurWidth}
        name={`blurWidth`}
        value={settings[blur].blurWidth}
        onChange={handleOnChange(blur)}
        slider
        numberRange={{
          min: 0,
          max: 25,
        }}
      />
    </div>
  );
};

export default SimpleSettingsEditor;
