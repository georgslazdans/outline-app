import { Dictionary } from "@/app/dictionaries";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { ChangeEvent } from "react";
import { PROCESSING_STEPS } from "@/lib/opencv/processor/ImageProcessor";
import StepSettingField from "./StepSettingField";
import StepSettingGroup from "./StepSettingGroup";
import StepSetting, {
  GroupConfig,
  StepSettingConfig,
  eventFieldConverterFor,
} from "@/lib/opencv/processor/steps/StepSettings";

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
    const config = PROCESSING_STEPS.find((it) => it.name == step)?.config;
    if (!config) {
      throw new Error(`Config not found for key: ${key} with step: ${step}}`);
    }
    return config[key];
  };

  return (
    <div className="xl:w-1/2">
      <h2 className="text-center p-2 w-full">{dictionary.calibration.settings}</h2>
      <div className="flex flex-col gap-1">
        {currentSetting &&
          Object.keys(currentSetting).map((key) => {
            const config = configOf(key);
            if (!config) {
              console.warn("No config found for setting: ", key);
              return;
            }
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
    </div>
  );
};
