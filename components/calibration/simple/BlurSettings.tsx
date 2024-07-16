"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../advanced/StepSettingField";
import blurStep from "@/lib/opencv/processor/steps/Blur";
import StepName from "@/lib/opencv/processor/steps/StepName";

const BLUR_WIDTH = "blurWidth";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const BlurSettings = ({ dictionary, settings, onSettingsChange }: Props) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const blurValue = Number.parseInt(event.target.value);
    const blurSettings = { ...settings[StepName.BLUR], blurWidth: blurValue };

    const objectBlur = {
      ...settings[StepName.BLUR_OBJECT],
      blurWidth: blurValue,
    };

    const thresholdSettings = {
      ...settings[StepName.ADAPTIVE_THRESHOLD],
      blockSize: blurValue - 4,
    };

    const objectThreshold = {
      ...settings[StepName.OBJECT_THRESHOLD],
      adaptiveSettings: {
        ...settings[StepName.OBJECT_THRESHOLD].adaptiveSettings,
        blockSize: blurValue - 4,
      },
    };

    const updatedSettings = {
      ...settings,
      [StepName.BLUR]: blurSettings,
      [StepName.BLUR_OBJECT]: objectBlur,
      [StepName.ADAPTIVE_THRESHOLD]: thresholdSettings,
      [StepName.OBJECT_THRESHOLD]: objectThreshold,
    };

    onSettingsChange(updatedSettings);
  };

  const blurConfig = {...blurStep.config![BLUR_WIDTH], min: 7};
  return (
    <>
      <SettingGroup dictionary={dictionary} name="blur">
        <StepSettingField
          value={settings[StepName.BLUR].blurWidth}
          name={BLUR_WIDTH}
          config={blurConfig}
          handleOnChange={onChange}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default BlurSettings;
