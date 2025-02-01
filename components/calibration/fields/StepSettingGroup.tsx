import { Dictionary } from "@/app/dictionaries";
import StepSettingField from "./StepSettingField";
import StepSetting, {
  StepSettingConfig,
} from "@/lib/opencv/processor/steps/StepSettings";
import StepName from "@/lib/opencv/processor/steps/StepName";
import Settings from "@/lib/opencv/Settings";

type Props = {
  name: string;
  dictionary: Dictionary;
  settings: StepSetting;
  settingsConfig: { [key: string]: StepSettingConfig };
  onChange: (stepSettings: StepSetting) => void;
  stepName: string;
  allSettings: Settings;
};

const StepSettingGroup = ({
  onChange,
  name,
  settings,
  settingsConfig,
  dictionary,
  stepName,
  allSettings,
}: Props) => {
  const settingLabel = (name: string) => {
    //@ts-ignore
    return dictionary.calibration.stepSettings[name];
  };

  const handleOnChange = (key: string) => {
    return (value: any) => {
      const updatedSetting = {
        ...settings,
        [key]: value,
      };
      onChange(updatedSetting);
    };
  };

  return (
    <>
      <h3 className="ml-2">{settingLabel(name)}</h3>
      {Object.keys(settings).map((key) => {
        const fieldConfig = settingsConfig[key];
        if (
          !fieldConfig ||
          (fieldConfig.display &&
            !fieldConfig.display(allSettings, stepName as StepName))
        ) {
          return <></>;
        }
        return (
          <StepSettingField
            key={key}
            name={key}
            value={settings[key]}
            config={fieldConfig}
            onChange={handleOnChange(key)}
            dictionary={dictionary}
          ></StepSettingField>
        );
      })}
    </>
  );
};

export default StepSettingGroup;
