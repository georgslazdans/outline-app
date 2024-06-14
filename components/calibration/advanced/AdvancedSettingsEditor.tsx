import { Dictionary } from "@/app/dictionaries";
import StepName from "@/lib/opencv/steps/StepName";
import { ChangeEvent } from "react";
import { processingSteps } from "@/lib/opencv/ImageProcessor";
import StepSettingField from "./StepSettingField";
import StepSettingGroup from "./StepSettingGroup";
import StepSetting, { GroupConfig, StepSettingConfig, eventFieldConverterFor } from "@/lib/opencv/steps/StepSettings";

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

  const handleOnChange = (key: string, config: StepSettingConfig) => {
    const fieldConverter = eventFieldConverterFor(config);
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSetting = {
        ...currentSetting,
        [key]: fieldConverter(event),
      };
      onChange(updatedSetting);
    };
  };

  const handleOnGroupChange = (key: string) => {
    return (stepSettings: StepSetting) => {
      const updatedSetting = {
        ...currentSetting,
        [key]: stepSettings,
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
          const config = configOf(key);
          if (config.type == "group") {
            const groupConfig = config as GroupConfig;
            return (
              <StepSettingGroup
                key={key}
                name={key}
                settings={currentSetting[key]}
                config={groupConfig.config}
                onChange={handleOnGroupChange(key)}
                dictionary={dictionary}
              ></StepSettingGroup>
            );
          } else {
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
          }
        })}
    </div>
  );
};
