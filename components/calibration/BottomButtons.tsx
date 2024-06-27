"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../Button";

type Props = {
  rerun: () => void;
  onClose: () => void;
  settingsChanged: boolean;
  dictionary: Dictionary;
};

const BottomButtons = ({
  rerun,
  onClose,
  settingsChanged,
  dictionary,
}: Props) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => rerun()}
        style={settingsChanged ? "red" : "disabled"}
      >
        <label>{dictionary.calibration.rerun}</label>
      </Button>
      <Button onClick={() => onClose()}>
        <label>{dictionary.calibration.done}</label>
      </Button>
    </div>
  );
};

export default BottomButtons;
