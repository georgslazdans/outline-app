"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../fields/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { GroupConfig } from "@/lib/opencv/processor/steps/StepSettings";
import CalibrationSettingStep from "./CalibrationSettingStep";
import findObjectOutlinesStep from "@/lib/opencv/processor/steps/FindObjectOutlines";
import { useNestedStepChangeHandler } from "../../fields/ChangeHandler";

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
  const onFindOutlinesChanged = useNestedStepChangeHandler(
    StepName.FIND_OBJECT_OUTLINES,
    settings,
    onSettingsChange
  );

  const holeSettings = settings[StepName.FIND_OBJECT_OUTLINES]?.holeSettings;
  const smoothSettings =
    settings[StepName.FIND_OBJECT_OUTLINES]?.smoothSettings;

  const smoothConfig: GroupConfig = findObjectOutlinesStep.config!
    .smoothSettings as GroupConfig;

  const holeConfig: GroupConfig = findObjectOutlinesStep.config!
    .holeSettings as GroupConfig;
  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="holeSettings"
        settingStep={CalibrationSettingStep.HOLE_AND_SMOOTHING}
        settings={settings}
      >
        <StepSettingField
          value={holeSettings?.meanThreshold}
          name={MEAN_THRESHOLD}
          config={holeConfig.config[MEAN_THRESHOLD]}
          onChange={onFindOutlinesChanged(MEAN_THRESHOLD, "holeSettings")}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={holeSettings?.holeAreaThreshold}
          name={HOLE_AREA_THRESHOLD}
          config={holeConfig.config[HOLE_AREA_THRESHOLD]}
          onChange={onFindOutlinesChanged(HOLE_AREA_THRESHOLD, "holeSettings")}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={smoothSettings?.smoothAccuracy}
          name={SMOOTH_ACCURACY}
          config={smoothConfig.config[SMOOTH_ACCURACY]}
          onChange={onFindOutlinesChanged(SMOOTH_ACCURACY, "smoothSettings")}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default HoleAndSmoothSettings;
