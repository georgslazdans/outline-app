"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../advanced/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import extractObjectStep from "@/lib/opencv/processor/steps/ExtractObject";
import { GroupConfig } from "@/lib/opencv/processor/steps/StepSettings";

const MEAN_THRESHOLD = "meanThreshold";
const HOLE_AREA_THRESHOLD = "holeAreaTreshold";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const HoleSettings = ({ dictionary, settings, onSettingsChange }: Props) => {
  const onChange = (field: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = Number.parseFloat(event.target.value);
      const stepSettings = {
        ...settings[StepName.EXTRACT_OBJECT],
        holeSettings: {
          ...settings[StepName.EXTRACT_OBJECT].holeSettings,
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

  const holeSettings: GroupConfig = extractObjectStep.config!
    .holeSettings as GroupConfig;
  return (
    <>
      <SettingGroup dictionary={dictionary} name="holeSettings">
        <StepSettingField
          value={settings[StepName.EXTRACT_OBJECT].holeSettings?.meanThreshold}
          name={MEAN_THRESHOLD}
          config={holeSettings.config[MEAN_THRESHOLD]}
          handleOnChange={onChange(MEAN_THRESHOLD)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={
            settings[StepName.EXTRACT_OBJECT].holeSettings?.holeAreaTreshold
          }
          name={HOLE_AREA_THRESHOLD}
          config={holeSettings.config[HOLE_AREA_THRESHOLD]}
          handleOnChange={onChange(HOLE_AREA_THRESHOLD)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default HoleSettings;
