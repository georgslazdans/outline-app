"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../advanced/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { GroupConfig } from "@/lib/opencv/processor/steps/StepSettings";
import CalibrationSettingStep from "./CalibrationSettingStep";
import findObjectOutlinesStep from "@/lib/opencv/processor/steps/FindObjectOutlines";

const MEAN_THRESHOLD = "meanThreshold";
const HOLE_AREA_THRESHOLD = "holeAreaThreshold";
const SMOOTH_ACCURACY = "smoothAccuracy";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const HoleAndSmoothSettings = ({
  dictionary,
  settings,
  onSettingsChange,
}: Props) => {
  const onChange = (field: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = Number.parseFloat(event.target.value);
      const stepSettings = {
        ...settings[StepName.FIND_OBJECT_OUTLINES],
        holeSettings: {
          ...settings[StepName.FIND_OBJECT_OUTLINES].holeSettings,
          [field]: value,
        },
      };

      const updatedSettings = {
        ...settings,
        [StepName.FIND_OBJECT_OUTLINES]: stepSettings,
      };

      onSettingsChange(updatedSettings);
    };
  };
  const onSmoothValueChanged = (field: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = Number.parseFloat(event.target.value);
      const stepSettings = {
        ...settings[StepName.FIND_OBJECT_OUTLINES],
        smoothSettings: {
          ...settings[StepName.FIND_OBJECT_OUTLINES].smoothSettings,
          [field]: value,
        },
      };

      const updatedSettings = {
        ...settings,
        [StepName.FIND_OBJECT_OUTLINES]: stepSettings,
      };

      onSettingsChange(updatedSettings);
    };
  };

  const smoothSettings: GroupConfig = findObjectOutlinesStep.config!
    .smoothSettings as GroupConfig;

  const holeSettings: GroupConfig = findObjectOutlinesStep.config!
    .holeSettings as GroupConfig;
  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="holeSettings"
        settingStep={CalibrationSettingStep.HOLE_AND_SMOOTHING}
      >
        <StepSettingField
          value={
            settings[StepName.FIND_OBJECT_OUTLINES]?.holeSettings?.meanThreshold
          }
          name={MEAN_THRESHOLD}
          config={holeSettings.config[MEAN_THRESHOLD]}
          handleOnChange={onChange(MEAN_THRESHOLD)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={
            settings[StepName.FIND_OBJECT_OUTLINES]?.holeSettings
              ?.holeAreaThreshold
          }
          name={HOLE_AREA_THRESHOLD}
          config={holeSettings.config[HOLE_AREA_THRESHOLD]}
          handleOnChange={onChange(HOLE_AREA_THRESHOLD)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={
            settings[StepName.FIND_OBJECT_OUTLINES]?.smoothSettings
              ?.smoothAccuracy
          }
          name={SMOOTH_ACCURACY}
          config={smoothSettings.config[SMOOTH_ACCURACY]}
          handleOnChange={onSmoothValueChanged(SMOOTH_ACCURACY)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default HoleAndSmoothSettings;
