"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React from "react";

type Props = {
  dictionary: Dictionary;
  openAdvancedMode: () => void;
  exportSvg: () => void;
};

const SimpleSettingsButtons = ({ dictionary, openAdvancedMode, exportSvg }: Props) => {
  return (
    <>
      {" "}
      <Button onClick={openAdvancedMode} style="secondary">
        <label>{dictionary.calibration.advancedSettings}</label>
      </Button>
      <Button onClick={exportSvg} style="secondary">
        <label>{dictionary.calibration.exportSvg}</label>
      </Button>
    </>
  );
};

export default SimpleSettingsButtons;
