import { Dictionary } from "@/app/dictionaries";
import StepName from "@/lib/opencv/steps/StepName";
import {
  StepSettingConfig,
  StepSetting,
} from "@/lib/opencv/steps/ProcessingFunction";
import { ChangeEvent } from "react";
import { processingSteps } from "@/lib/opencv/ImageProcessor";
import StepSettingField from "./StepSettingField";

type Props = {
  dictionary: Dictionary;
  currentSetting?: StepSetting;
  step?: StepName;
  onChange: (stepSettings: StepSetting) => void;
};

export const AdvancedSettingsEditor = ({
  dictionary,
  currentSetting,
  step,
  onChange,
}: Props) => {
  if (!step || !currentSetting) {
    return null;
  }

  const handleOnChange = (key: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      // TODO boolean values, nested values
      const updatedSetting = {
        ...currentSetting,
        [key]: Number.parseInt(event.target.value),
      };
      // setCurrentSetting(updatedSetting);
      onChange(updatedSetting);
    };
  };

  const configOf = (key: string): StepSettingConfig => {
    const config = processingSteps.find((it) => it.name == step)?.config;
    if (!config) {
      throw new Error(`Config not found for key: ${key} with step: ${step}}`);
    }
    return config[key];
  };

  return (
    <div>
      <h2 className="text-center p-2">{dictionary.calibration.settings}</h2>
      {currentSetting &&
        Object.keys(currentSetting).map((key) => {
          return (
            <StepSettingField
              key={key}
              name={key}
              value={currentSetting[key]}
              config={configOf(key)}
              handleOnChange={handleOnChange(key)}
              dictionary={dictionary}
            ></StepSettingField>
          );
        })}
    </div>
  );
};
