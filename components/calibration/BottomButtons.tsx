"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../Button";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import UserPreference from "@/lib/preferences/UserPreference";

type Props = {
  rerun: () => void;
  onClose: () => void;
  settingsChanged: boolean;
  dictionary: Dictionary;
  simpleMode: boolean;
};

const BottomButtons = ({
  rerun,
  onClose,
  settingsChanged,
  dictionary,
  simpleMode,
}: Props) => {
  const { value: autoRerun } = useUserPreference(
    UserPreference.AUTO_RERUN_ON_SETTING_CHANGE
  );

  const calibrationStrings = dictionary.calibration;

  return (
    <div className="flex gap-4 justify-center">
      {!autoRerun && (
        <Button
          onClick={() => rerun()}
          style={settingsChanged ? "red" : "disabled"}
        >
          <label className="cursor-pointer">{calibrationStrings.rerun}</label>
        </Button>
      )}
      <Button onClick={() => onClose()} className="xl:max-w-[50%]">
        <label className="cursor-pointer xl:hidden">
          {simpleMode
            ? autoRerun
              ? calibrationStrings.saveAndClose
              : calibrationStrings.close
            : calibrationStrings.done}
        </label>
        <label className="cursor-pinter hidden xl:block">
          {simpleMode
            ? calibrationStrings.saveAndClose
            : calibrationStrings.done}
        </label>
      </Button>
    </div>
  );
};

export default BottomButtons;
