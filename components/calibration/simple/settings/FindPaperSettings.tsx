"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../advanced/StepSettingField";
import blurStep from "@/lib/opencv/processor/steps/Blur";
import StepName from "@/lib/opencv/processor/steps/StepName";
import adaptiveThresholdStep from "@/lib/opencv/processor/steps/AdaptiveThreshold";
import bilateralFilterStep from "@/lib/opencv/processor/steps/BilateralFilter";
import extractPaperStep from "@/lib/opencv/processor/steps/ExtractPaper";
import CalibrationSettingStep from "./CalibrationSettingStep";

const PIXEL_DIAMETER = "pixelDiameter";
const BLUR_WIDTH = "blurWidth";
const BLOCK_SIZE = "blockSize";
const PAPER_INDEX = "paperIndex";

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
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <SettingGroup
        dictionary={dictionary}
        name="findPaper"
        settingStep={CalibrationSettingStep.FIND_PAPER}
      >
        <StepSettingField
          value={settings[StepName.BILATERAL_FILTER][PIXEL_DIAMETER]}
          name={"bilateralFilterPixelDiameter"}
          config={bilateralFilterStep.config![PIXEL_DIAMETER]}
          handleOnChange={onChange(StepName.BILATERAL_FILTER, PIXEL_DIAMETER)}
          dictionary={dictionary}
        ></StepSettingField>
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
        <StepSettingField
          value={settings[StepName.EXTRACT_PAPER][PAPER_INDEX]}
          name={PAPER_INDEX}
          config={extractPaperStep.config![PAPER_INDEX]}
          handleOnChange={onChange(StepName.EXTRACT_PAPER, PAPER_INDEX)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default FindPaperSettings;
