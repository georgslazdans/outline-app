"use client";

import React, { ChangeEvent } from "react";
import CheckboxField from "@/components/fields/CheckboxField";
import UserPreference from "@/lib/preferences/UserPreference";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import NumberField from "@/components/fields/NumberField";
import { Tooltip } from "react-tooltip";

type Props = {};

const UserPreferencesList = ({}: Props) => {
  const { value: autoRerun, updateEntry: updateAutoRerun } = useUserPreference(
    UserPreference.AUTO_RERUN_ON_SETTING_CHANGE
  );
  const {
    value: autoRerunDebounceTime,
    updateEntry: updateAutoRerunDebounceTime,
  } = useUserPreference(
    UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME
  );
  const { value: outlineAlphaLevel, updateEntry: updateOutlineAlphaLevel } =
    useUserPreference(UserPreference.OUTLINE_ALPHA_LEVEL);

  const onRerunSettingChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    updateAutoRerun(value);
  };

  const onDebounceTimeChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      const value = Number.parseInt(event.target.value);
      updateAutoRerunDebounceTime(value);
    }
  };

  const onOutlineAlphaLevelChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      const value = Number.parseFloat(event.target.value);
      updateOutlineAlphaLevel(value);
    }
  };

  return (
    <>
      <h2 className="mb-2">Preferences</h2>
      <CheckboxField
        label={"Auto Rerun On Setting Change"}
        name={UserPreference.AUTO_RERUN_ON_SETTING_CHANGE}
        value={autoRerun as boolean}
        onChange={onRerunSettingChanged}
      ></CheckboxField>
      <NumberField
        label={"Auto Rerun Debounce Time"}
        name={UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME}
        value={autoRerunDebounceTime as number}
        onChange={onDebounceTimeChanged}
      ></NumberField>
      <Tooltip
        anchorSelect={
          "#" + UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME
        }
      >
        Number of milliseconds before executing rerun after config change
      </Tooltip>

      <NumberField
        label={"Outline Alpha Level"}
        name={UserPreference.OUTLINE_ALPHA_LEVEL}
        value={outlineAlphaLevel as number}
        onChange={onOutlineAlphaLevelChanged}
        numberRange={{
          min: 0,
          max: 1,
          step: 0.01,
        }}
      ></NumberField>
    </>
  );
};

export default UserPreferencesList;
