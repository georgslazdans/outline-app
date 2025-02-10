"use client";

import CheckboxField from "@/components/fields/CheckboxField";
import NumberField from "@/components/fields/NumberField";
import UserPreference from "@/lib/preferences/UserPreference";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import { ChangeEvent } from "react";

const AutoScaleAlongNormal = () => {
  const { value: autoScale, updateEntry: updateAutoScale } = useUserPreference(
    UserPreference.AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT
  );
  const { value: autoScaleValue, updateEntry: updateAutoScaleValue } =
    useUserPreference(
      UserPreference.AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT_VALUE
    );

  const onAutoScaleChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    updateAutoScale(value);
  };

  const onAutoScaleValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      const value = Number.parseInt(event.target.value);
      updateAutoScaleValue(value);
    }
  };

  return (
    <>
      <CheckboxField
        label={"Scale Along Normals"}
        name={UserPreference.AUTO_RERUN_ON_SETTING_CHANGE}
        value={autoScale as boolean}
        onChange={onAutoScaleChanged}
      ></CheckboxField>
      {autoScale && (
        <NumberField
          label={"Scale Along Normals Value (mm)"}
          name={UserPreference.AUTO_RERUN_ON_SETTING_CHANGE_DEBOUNCE_TIME}
          value={autoScaleValue as number}
          onChange={onAutoScaleValueChanged}
        ></NumberField>
      )}
    </>
  );
};

export default AutoScaleAlongNormal;
