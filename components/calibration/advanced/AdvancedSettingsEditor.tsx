import { Dictionary } from "@/app/dictionaries";
import StepName from "@/lib/opencv/processor/steps/StepName";
import StepSettingField from "../fields/StepSettingField";
import StepSettingGroup from "../fields/StepSettingGroup";
import StepSetting, {
  GroupConfig,
  configOf,
} from "@/lib/opencv/processor/steps/StepSettings";
import Settings from "@/lib/opencv/Settings";

type Props = {
  dictionary: Dictionary;
  currentSetting?: StepSetting;
  settings: Settings;
  step?: StepName;
  onChange: (stepSettings: StepSetting) => void;
};

export const AdvancedSettingsEditor = ({
  dictionary,
  currentSetting,
  settings,
  step,
  onChange,
}: Props) => {
  if (!step || !currentSetting) {
    return null;
  }

  // TODO handle change update
  const handleOnChange = (key: string) => {
    return (value: any) => {
      const updatedSetting = {
        ...settings,
        [key]: value,
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

  return (
    <div className="xl:w-1/2">
      <h2 className="text-center p-2 w-full">
        {dictionary.calibration.settings}
      </h2>
      <div className="flex flex-col gap-1">
        {currentSetting &&
          Object.keys(currentSetting).map((key) => {
            const config = configOf(step, key);
            if (!config) {
              return;
            }
            if (config.display && !config.display(settings, step)) {
              return <></>;
            }
            if (config.type == "group") {
              const groupConfig = config as GroupConfig;
              return (
                <StepSettingGroup
                  key={key}
                  name={key}
                  settings={currentSetting[key]}
                  settingsConfig={groupConfig.config}
                  onChange={handleOnGroupChange(key)}
                  dictionary={dictionary}
                  stepName={step}
                  allSettings={settings}
                ></StepSettingGroup>
              );
            } else {
              const config = configOf(step, key);
              if (config) {
                return (
                  <StepSettingField
                    key={key}
                    name={key}
                    value={currentSetting[key]}
                    config={config}
                    onChange={handleOnChange(key)}
                    dictionary={dictionary}
                  ></StepSettingField>
                );
              }
            }
          })}
      </div>
      {(!currentSetting || Object.keys(currentSetting).length == 0) && (
        <div className="ml-4">
          <label>No settings available!</label>
        </div>
      )}
    </div>
  );
};
