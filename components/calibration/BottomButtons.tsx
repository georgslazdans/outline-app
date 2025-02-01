"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../Button";

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
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => rerun()}
        style={settingsChanged ? "red" : "disabled"}
      >
        <label className="cursor-pointer">{dictionary.calibration.rerun}</label>
      </Button>
      <Button onClick={() => onClose()}>
        <label className="cursor-pointer">
          {simpleMode
            ? dictionary.calibration.save
            : dictionary.calibration.done}
        </label>
      </Button>
    </div>
  );
};

export default BottomButtons;
