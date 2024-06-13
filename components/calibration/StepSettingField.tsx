import {
  StepSettingConfig,
  NumberConfig,
} from "@/lib/opencv/steps/ProcessingFunction";
import InputField from "../fiields/InputField";
import NumberField from "../fiields/NumberField";
import { ChangeEvent } from "react";
import { Dictionary } from "@/app/dictionaries";

type Props = {
  value: string | number | undefined;
  name: string;
  config: StepSettingConfig;
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  dictionary: Dictionary;
};

const StepSettingField = ({
  value,
  name,
  config,
  handleOnChange,
  dictionary,
}: Props) => {
  const settingLabel = (name: string) => {
    //@ts-ignore
    return dictionary.calibration.stepSettings[name];
  };

  const inputField = (name: string) => {
    return (
      <InputField
        key={name}
        label={settingLabel(name)}
        name={`${name}`}
        value={value}
        onChange={handleOnChange}
      />
    );
  };

  const numberField = (name: string, config: StepSettingConfig) => {
    const numberConfig = config as NumberConfig;
    return (
      <NumberField
        className="mt-1"
        key={name}
        label={settingLabel(name)}
        name={`${name}`}
        value={value}
        onChange={handleOnChange}
        numberRange={{
          min: numberConfig.min,
          max: numberConfig.max,
        }}
        slider
      />
    );
  };

  const fieldFor = (name: string) => {
    if (!config) {
      return <></>;
    }
    switch (config.type) {
      case "number":
        return numberField(name, config);
      case "group":
      case "checkbox":
        return <></>;
    }
  };

  return fieldFor(name);
};

export default StepSettingField;
