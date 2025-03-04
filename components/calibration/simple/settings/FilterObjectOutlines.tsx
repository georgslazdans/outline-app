"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../fields/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import CalibrationSettingStep from "./CalibrationSettingStep";
import filterObjectsStep from "@/lib/opencv/processor/steps/FilterObjects";
import { useStepChangeHandler } from "../../fields/ChangeHandler";

const OBJECT_INDEXES = "objectIndexes";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
};

const FilterObjectOutlines = ({
  dictionary,
  settings,
  onSettingsChange,
}: Props) => {
  const onChange = useStepChangeHandler(
    StepName.FILTER_OBJECTS,
    settings,
    onSettingsChange
  );

  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="filterObjects"
        settingStep={CalibrationSettingStep.FILTER_OBJECTS}
        settings={settings}
      >
        <StepSettingField
          value={settings[StepName.FILTER_OBJECTS]?.objectIndexes}
          name={OBJECT_INDEXES}
          config={filterObjectsStep.config![OBJECT_INDEXES]}
          onChange={onChange(OBJECT_INDEXES)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default FilterObjectOutlines;
