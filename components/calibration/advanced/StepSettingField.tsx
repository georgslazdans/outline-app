import {
  StepSettingConfig,
  NumberConfig,
} from "@/lib/opencv/steps/ProcessingFunction";
import NumberField from "../../fiields/NumberField";
import { ChangeEvent } from "react";
import { Dictionary } from "@/app/dictionaries";
import CheckboxField from "../../fiields/CheckboxField";

type Props = {
  value: string | number | boolean | undefined;
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

  const checkboxField = (name: string) => {
    return (
      <CheckboxField
        key={name}
        label={settingLabel(name)}
        name={`${name}`}
        value={value as boolean}
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
        value={value as number}
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
      case "checkbox":
        return checkboxField(name);
      case "group":
        return <></>;
    }
  };

  return fieldFor(name);
};

export default StepSettingField;
