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

  const settingsUpdaterFor = (config: StepSettingConfig) => {
    switch (config.type) {
      case "number":
        return (event: ChangeEvent<HTMLInputElement>) => Number.parseInt(event.target.value);
      case "group":
        return (event: ChangeEvent<HTMLInputElement>) => event.target.value;
      case "checkbox":
        return (event: ChangeEvent<HTMLInputElement>) => event.target.checked;
    }
  };

  const handleOnChange = (key: string, config: StepSettingConfig) => {
    const fieldConverter = settingsUpdaterFor(config);
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSetting = {
        ...currentSetting,
        [key]: fieldConverter(event),
      };
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
              handleOnChange={handleOnChange(key, configOf(key))}
              dictionary={dictionary}
            ></StepSettingField>
          );
        })}
    </div>
  );
};
