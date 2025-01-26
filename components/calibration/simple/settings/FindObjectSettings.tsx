"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings, { inSettings } from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../advanced/StepSettingField";
import blurStep from "@/lib/opencv/processor/steps/Blur";
import StepName from "@/lib/opencv/processor/steps/StepName";
import adaptiveThresholdStep from "@/lib/opencv/processor/steps/AdaptiveThreshold";
import binaryThresholdStep from "@/lib/opencv/processor/steps/BinaryThreshold";
import CalibrationSettingStep from "./CalibrationSettingStep";

const BLUR_WIDTH = "blurWidth";
const BLOCK_SIZE = "blockSize";
const THRESHOLD = "threshold";
const INVERSE_THRESHOLD = "inverseThreshold";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const FindObjectSettings = ({
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
  const onObjectThresholdChange = (
    fieldName: string,
    settingsField: string
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = Number.parseInt(event.target.value);
      const subSettings = {
        ...settings[StepName.OBJECT_THRESHOLD],
        [settingsField]: {
          ...settings[StepName.OBJECT_THRESHOLD][settingsField],
          [fieldName]: value,
        },
      };
      const updatedSettings = {
        ...settings,
        [StepName.OBJECT_THRESHOLD]: subSettings,
      };
      onSettingsChange(updatedSettings);
    };
  };
  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="findObject"
        settingStep={CalibrationSettingStep.FIND_OBJECT}
      >
        {!inSettings(settings).isBlurReused() && (
          <StepSettingField
            value={settings[StepName.BLUR_OBJECT][BLUR_WIDTH]}
            name={BLUR_WIDTH}
            config={blurStep.config![BLUR_WIDTH]}
            handleOnChange={onChange(StepName.BLUR_OBJECT, BLUR_WIDTH)}
            dictionary={dictionary}
          ></StepSettingField>
        )}

        {inSettings(settings).isObjectThresholdAdaptive() && (
          <StepSettingField
            value={
              settings[StepName.OBJECT_THRESHOLD].adaptiveSettings[BLOCK_SIZE]
            }
            name={BLOCK_SIZE}
            config={adaptiveThresholdStep.config![BLOCK_SIZE]}
            handleOnChange={onObjectThresholdChange(
              BLOCK_SIZE,
              "adaptiveSettings"
            )}
            dictionary={dictionary}
          ></StepSettingField>
        )}

        {!inSettings(settings).isObjectThresholdAdaptive() && (
          <>
            <StepSettingField
              value={
                settings[StepName.OBJECT_THRESHOLD].binarySettings[THRESHOLD]
              }
              name={THRESHOLD}
              config={binaryThresholdStep.config![THRESHOLD]}
              handleOnChange={onObjectThresholdChange(
                THRESHOLD,
                "binarySettings"
              )}
              dictionary={dictionary}
            ></StepSettingField>

            <StepSettingField
              value={
                settings[StepName.OBJECT_THRESHOLD].binarySettings[
                  INVERSE_THRESHOLD
                ]
              }
              name={INVERSE_THRESHOLD}
              config={binaryThresholdStep.config![INVERSE_THRESHOLD]}
              handleOnChange={onObjectThresholdChange(
                INVERSE_THRESHOLD,
                "binarySettings"
              )}
              dictionary={dictionary}
            ></StepSettingField>
          </>
        )}
      </SettingGroup>
    </>
  );
};

export default FindObjectSettings;
