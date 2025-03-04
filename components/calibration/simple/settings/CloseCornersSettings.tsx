"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../fields/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import closeContoursStep from "@/lib/opencv/processor/steps/CloseContours";
import CalibrationSettingStep from "./CalibrationSettingStep";
import { useStepChangeHandler } from "../../fields/ChangeHandler";

const KERNEL_SIZE = "kernelSize";
const ITERATIONS = "iterations";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  stepName: StepName;
  settingStep: CalibrationSettingStep;
};

const CloseCornerSettings = ({
  dictionary,
  settings,
  onSettingsChange,
  stepName,
  settingStep,
}: Props) => {
  const onChange = useStepChangeHandler(stepName, settings, onSettingsChange);
  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name={stepName}
        settingStep={settingStep}
        settings={settings}
      >
        <StepSettingField
          value={settings[stepName].kernelSize}
          name={KERNEL_SIZE}
          config={closeContoursStep.config![KERNEL_SIZE]}
          onChange={onChange(KERNEL_SIZE)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={settings[stepName].iterations}
          name={ITERATIONS}
          config={closeContoursStep.config![ITERATIONS]}
          onChange={onChange(ITERATIONS)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default CloseCornerSettings;
