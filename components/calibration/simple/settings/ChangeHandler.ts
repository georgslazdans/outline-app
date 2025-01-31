import StepName from "@/lib/opencv/processor/steps/StepName";
import Settings from "@/lib/opencv/Settings";

export const useStepChangeHandler = (
  stepName: StepName,
  settings: Settings,
  onSettingsChange: (settings: Settings) => void
) => {
  const onChange = (field: string) => {
    return (value: any) => {
      const stepSettings = {
        ...settings[stepName],
        [field]: value,
      };

      const updatedSettings = {
        ...settings,
        [stepName]: stepSettings,
      };

      onSettingsChange(updatedSettings);
    };
  };

  return onChange;
};

export const useNestedStepChangeHandler = (
  stepName: StepName,
  settings: Settings,
  onSettingsChange: (settings: Settings) => void
) => {
  const onChange = (field: string, nestedName: string) => {
    return (value: any) => {
      const stepSettings = {
        ...settings[stepName],
        [nestedName]: {
          ...settings[stepName][nestedName],
          [field]: value,
        },
      };

      const updatedSettings = {
        ...settings,
        [stepName]: stepSettings,
      };

      onSettingsChange(updatedSettings);
    };
  };

  return onChange;
};
