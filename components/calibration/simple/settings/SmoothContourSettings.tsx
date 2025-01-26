"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../advanced/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { GroupConfig } from "@/lib/opencv/processor/steps/StepSettings";
import extractObjectStep from "@/lib/opencv/processor/steps/ExtractObject";
import StepResult from "@/lib/opencv/StepResult";
import CalibrationSettingStep from "./CalibrationSettingStep";

const SMOOTH_ACCURACY = "smoothAccuracy";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const SmoothContourSettings = ({
  dictionary,
  settings,
  onSettingsChange,
}: Props) => {
  const onChange = (field: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = Number.parseFloat(event.target.value);
      const stepSettings = {
        ...settings[StepName.EXTRACT_OBJECT],
        smoothSettings: {
          ...settings[StepName.EXTRACT_OBJECT].smoothSettings,
          [field]: value,
        },
      };

      const updatedSettings = {
        ...settings,
        [StepName.EXTRACT_OBJECT]: stepSettings,
      };

      onSettingsChange(updatedSettings);
    };
  };

  const smoothSettings: GroupConfig = extractObjectStep.config!
    .smoothSettings as GroupConfig;
  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="smoothSettings"
        settingStep={CalibrationSettingStep.SMOOTHING}
      >
        <StepSettingField
          value={
            settings[StepName.EXTRACT_OBJECT].smoothSettings?.smoothAccuracy
          }
          name={SMOOTH_ACCURACY}
          config={smoothSettings.config[SMOOTH_ACCURACY]}
          handleOnChange={onChange(SMOOTH_ACCURACY)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default SmoothContourSettings;
