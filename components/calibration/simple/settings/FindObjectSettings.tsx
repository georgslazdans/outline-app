"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings, { inSettings } from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../fields/StepSettingField";
import blurStep from "@/lib/opencv/processor/steps/Blur";
import StepName from "@/lib/opencv/processor/steps/StepName";
import adaptiveThresholdStep from "@/lib/opencv/processor/steps/AdaptiveThreshold";
import binaryThresholdStep from "@/lib/opencv/processor/steps/BinaryThreshold";
import CalibrationSettingStep from "./CalibrationSettingStep";
import thresholdStep from "@/lib/opencv/processor/steps/Threshold";
import {
  useNestedStepChangeHandler,
  useStepChangeHandler,
} from "../../fields/ChangeHandler";
import bilateralFilterStep from "@/lib/opencv/processor/steps/BilateralFilter";

const PIXEL_DIAMETER = "pixelDiameter";

const BLUR_WIDTH = "blurWidth";
const THRESHOLD_TYPE = "thresholdType";
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
  const onBilateralFilterChange = useStepChangeHandler(
    StepName.BILATERAL_FILTER,
    settings,
    onSettingsChange
  );

  const onBlurChange = useStepChangeHandler(
    StepName.BLUR_OBJECT,
    settings,
    onSettingsChange
  );

  const onThresholdChange = useStepChangeHandler(
    StepName.OBJECT_THRESHOLD,
    settings,
    onSettingsChange
  );

  const onNestedThresholdChange = useNestedStepChangeHandler(
    StepName.OBJECT_THRESHOLD,
    settings,
    onSettingsChange
  );

  const { isPaperDetectionSkipped, isBilateralFilterDisabled } =
    inSettings(settings);

  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="findObject"
        settingStep={CalibrationSettingStep.FIND_OBJECT}
        settings={settings}
      >
        {isPaperDetectionSkipped() && !isBilateralFilterDisabled() && (
          <StepSettingField
            value={settings[StepName.BILATERAL_FILTER][PIXEL_DIAMETER]}
            name={"bilateralFilterPixelDiameter"}
            config={bilateralFilterStep.config![PIXEL_DIAMETER]}
            onChange={onBilateralFilterChange(PIXEL_DIAMETER)}
            dictionary={dictionary}
          ></StepSettingField>
        )}

        {!inSettings(settings).isBlurReused() && (
          <StepSettingField
            value={settings[StepName.BLUR_OBJECT][BLUR_WIDTH]}
            name={BLUR_WIDTH}
            config={blurStep.config![BLUR_WIDTH]}
            onChange={onBlurChange(BLUR_WIDTH)}
            dictionary={dictionary}
          ></StepSettingField>
        )}

        <StepSettingField
          value={settings[StepName.OBJECT_THRESHOLD][THRESHOLD_TYPE]}
          name={THRESHOLD_TYPE}
          config={thresholdStep.config![THRESHOLD_TYPE]}
          onChange={onThresholdChange(THRESHOLD_TYPE)}
          dictionary={dictionary}
        ></StepSettingField>

        {inSettings(settings).isObjectThresholdAdaptive() && (
          <StepSettingField
            value={
              settings[StepName.OBJECT_THRESHOLD].adaptiveSettings[BLOCK_SIZE]
            }
            name={BLOCK_SIZE}
            config={adaptiveThresholdStep.config![BLOCK_SIZE]}
            onChange={onNestedThresholdChange(BLOCK_SIZE, "adaptiveSettings")}
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
              onChange={onNestedThresholdChange(THRESHOLD, "binarySettings")}
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
              onChange={onNestedThresholdChange(
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
