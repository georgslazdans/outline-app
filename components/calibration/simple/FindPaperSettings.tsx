"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../advanced/StepSettingField";
import blurStep from "@/lib/opencv/processor/steps/Blur";
import StepName from "@/lib/opencv/processor/steps/StepName";
import adaptiveThresholdStep from "@/lib/opencv/processor/steps/AdaptiveThreshold";

const BLUR_WIDTH = "blurWidth";
const BLOCK_SIZE = "blockSize";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const FindPaperSettings = ({
  dictionary,
  settings,
  onSettingsChange,
}: Props) => {
  const onChange = (stepName: StepName, fieldName: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value);
      const updatedSettings = {
        ...settings,
        [stepName]: { ...settings[stepName], [fieldName]: value },
      };
      onSettingsChange(updatedSettings);
    };
  };
  return (
    <>
      <SettingGroup dictionary={dictionary} name="findPaper">
        <StepSettingField
          value={settings[StepName.BLUR][BLUR_WIDTH]}
          name={BLUR_WIDTH}
          config={blurStep.config![BLUR_WIDTH]}
          handleOnChange={onChange(StepName.BLUR, BLUR_WIDTH)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={settings[StepName.ADAPTIVE_THRESHOLD][BLOCK_SIZE]}
          name={BLOCK_SIZE}
          config={adaptiveThresholdStep.config![BLOCK_SIZE]}
          handleOnChange={onChange(StepName.ADAPTIVE_THRESHOLD, BLOCK_SIZE)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default FindPaperSettings;
