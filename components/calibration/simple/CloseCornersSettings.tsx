"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../advanced/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import closeContoursStep from "@/lib/opencv/processor/steps/CloseContours";

const KERNEL_SIZE = "kernelSize";
const ITERATIONS = "iterations";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const CloseCornerSettings = ({ dictionary, settings, onSettingsChange }: Props) => {
  const onChange = (field: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(event.target.value);
        const stepSettings = { ...settings[StepName.CLOSE_CORNERS], [field]: value };
    
        const updatedSettings = {
          ...settings,
          [StepName.CLOSE_CORNERS]: stepSettings
        };
    
        onSettingsChange(updatedSettings);
      };
  }
   
  return (
    <>
      <SettingGroup dictionary={dictionary} name="closeCorners">
        <StepSettingField
          value={settings[StepName.CLOSE_CORNERS].kernelSize}
          name={KERNEL_SIZE}
          config={closeContoursStep.config![KERNEL_SIZE]}
          handleOnChange={onChange(KERNEL_SIZE)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={settings[StepName.CLOSE_CORNERS].iterations}
          name={ITERATIONS}
          config={closeContoursStep.config![ITERATIONS]}
          handleOnChange={onChange(ITERATIONS)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default CloseCornerSettings;
