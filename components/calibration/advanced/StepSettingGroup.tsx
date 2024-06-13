import {
  StepSettingConfig,
  StepSetting,
  eventFieldConverterFor,
} from "@/lib/opencv/steps/ProcessingFunction";
import { Dictionary } from "@/app/dictionaries";
import StepSettingField from "./StepSettingField";
import { ChangeEvent } from "react";

type Props = {
  name: string;
  dictionary: Dictionary;
  settings: StepSetting;
  config: { [key: string]: StepSettingConfig };
  onChange: (stepSettings: StepSetting) => void;
};

const StepSettingGroup = ({
  onChange,
  name,
  settings,
  config,
  dictionary,
}: Props) => {
  const settingLabel = (name: string) => {
    //@ts-ignore
    return dictionary.calibration.stepSettings[name];
  };

  const handleOnChange = (key: string, config: StepSettingConfig) => {
    const fieldConverter = eventFieldConverterFor(config);
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSetting = {
        ...settings,
        [key]: fieldConverter(event),
      };
      onChange(updatedSetting);
    };
  };

  return (
    <>
      <h3>{settingLabel(name)}</h3>
      {Object.keys(settings).map((key) => {
        return (
          <StepSettingField
            key={key}
            name={key}
            value={settings[key]}
            config={config[key]}
            handleOnChange={handleOnChange(key, config[key])}
            dictionary={dictionary}
          ></StepSettingField>
        );
      })}
    </>
  );
};

export default StepSettingGroup;
