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
  allSettings: Settings;
  stepName?: StepName;
  onChange: (stepSettings: StepSetting) => void;
};

export const AdvancedSettingsEditor = ({
  dictionary,
  allSettings,
  stepName,
  onChange,
}: Props) => {
  if (!stepName) {
    return null;
  }
  const currentSetting = allSettings[stepName];
  if (!currentSetting) {
    return null;
  }

  const handleOnChange = (key: string) => {
    return (value: any) => {
      const updatedSetting = {
        ...currentSetting,
        [key]: value
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
            const config = configOf(stepName, key);
            if (!config) {
              return;
            }
            if (config.display && !config.display(allSettings, stepName)) {
              return;
            }
            if (config.type == "group") {
              const groupConfig = config as GroupConfig;
              return (
                <StepSettingGroup
                  key={key}
                  name={key}
                  settings={currentSetting[key]}
                  settingsConfig={groupConfig.config}
                  onChange={handleOnChange(key)}
                  dictionary={dictionary}
                  stepName={stepName}
                  allSettings={allSettings}
                ></StepSettingGroup>
              );
            } else {
              const config = configOf(stepName, key);
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
