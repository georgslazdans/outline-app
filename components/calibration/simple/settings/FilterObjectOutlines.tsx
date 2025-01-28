"use client";

import { Dictionary } from "@/app/dictionaries";
import Settings from "@/lib/opencv/Settings";
import React from "react";
import SettingGroup from "./SettingGroup";
import StepSettingField from "../../advanced/StepSettingField";
import StepName from "@/lib/opencv/processor/steps/StepName";
import CalibrationSettingStep from "./CalibrationSettingStep";
import filterObjectsStep from "@/lib/opencv/processor/steps/FilterObjects";

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
  const onChange = (field: string) => {
    return (value: number[]) => {
      const stepSettings = {
        ...settings[StepName.FILTER_OBJECTS],
        [field]: value,
      };
      const updatedSettings = {
        ...settings,
        [StepName.FILTER_OBJECTS]: stepSettings,
      };
      onSettingsChange(updatedSettings);
    };
  };
  return (
    <>
      <SettingGroup
        dictionary={dictionary}
        name="filterObjects"
        settingStep={CalibrationSettingStep.FILTER_OBJECTS}
      >
        <StepSettingField
          value={settings[StepName.FILTER_OBJECTS]?.objectIndexes}
          name={OBJECT_INDEXES}
          config={filterObjectsStep.config![OBJECT_INDEXES]}
          handleOnChange={onChange(OBJECT_INDEXES)}
          dictionary={dictionary}
        ></StepSettingField>
      </SettingGroup>
    </>
  );
};

export default FilterObjectOutlines;
