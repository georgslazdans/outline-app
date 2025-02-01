"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React from "react";

type Props = {
  dictionary: Dictionary;
  openAdvancedMode: () => void;
  exportSvg: () => void;
  exportDxf: () => void;
};

const SimpleSettingsButtons = ({ dictionary, openAdvancedMode, exportSvg, exportDxf}: Props) => {
  return (
    <>
      <Button className="mb-2" onClick={openAdvancedMode} style="secondary">
        <label>{dictionary.calibration.advancedSettings}</label>
      </Button>
      <label>{dictionary.calibration.export}</label>
      <Button onClick={exportSvg} style="secondary">
        <label>{dictionary.calibration.exportSvg}</label>
      </Button>
      <Button onClick={exportDxf} style="secondary">
        <label>{dictionary.calibration.exportDxf}</label>
      </Button>
    </>
  );
};

export default SimpleSettingsButtons;
