import NumberField from "../../fields/NumberField";
import { ChangeEvent } from "react";
import { Dictionary } from "@/app/dictionaries";
import CheckboxField from "../../fields/CheckboxField";
import SelectField from "@/components/fields/SelectField";
import {
  StepSettingConfig,
  NumberConfig,
  SelectConfig,
  eventFieldConverterFor,
} from "@/lib/opencv/processor/steps/StepSettings";
import { Tooltip } from "react-tooltip";
import PaperOutlineSelectField from "./PaperOutlineSelectField";
import ObjectOutlineFilterField from "./ObjectOutlineFilterField";

type FieldValue = string | number | boolean | number[] | undefined;

type Props = {
  value: FieldValue;
  name: string;
  config: StepSettingConfig;
  onChange: (value: FieldValue) => void;
  dictionary: Dictionary;
};

const StepSettingField = ({
  value,
  name,
  config,
  onChange,
  dictionary,
}: Props) => {
  const handleOnChangeEvent = () => {
    const fieldConverter = eventFieldConverterFor(config);
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(fieldConverter(event));
    };
  };

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
        onChange={handleOnChangeEvent()}
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
        onChange={handleOnChangeEvent()}
        numberRange={{
          min: numberConfig.min,
          max: numberConfig.max,
          step: numberConfig.step,
        }}
        slider
      />
    );
  };

  const selectField = (name: string, config: StepSettingConfig) => {
    const selectConfig = config as SelectConfig;
    return (
      <SelectField
        label={settingLabel(name)}
        name={name}
        options={selectConfig.optionsFunction(dictionary)}
        value={value as string}
        onChange={handleOnChangeEvent()}
      ></SelectField>
    );
  };

  const paperOutlineSelectField = (name: string) => {
    return (
      <PaperOutlineSelectField
        label={settingLabel(name)}
        name={name}
        value={value as number}
        onChange={handleOnChangeEvent()}
      ></PaperOutlineSelectField>
    );
  };

  const objectOutlineFilterField = (name: string) => {
    return (
      <ObjectOutlineFilterField
        label={settingLabel(name)}
        name={name}
        value={value as number[]}
        onChange={onChange}
      ></ObjectOutlineFilterField>
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
      case "select":
        return selectField(name, config);
      case "group":
        return <></>;
      case "paperOutlineSelect":
        return paperOutlineSelectField(name);
      case "objectOutlineFilter":
        return objectOutlineFilterField(name);
    }
  };

  const tooltipFor = (name: string, tooltip?: string) => {
    if (tooltip) {
      return (
        <>
          <Tooltip anchorSelect={"#" + name} place="top">
            {tooltip}
          </Tooltip>
          <Tooltip anchorSelect={"#" + name + "-slider"} place="top">
            {tooltip}
          </Tooltip>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      {fieldFor(name)}
      {tooltipFor(name, config.tooltip)}
    </>
  );
};

export default StepSettingField;
