"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React from "react";

type Props = {
  dictionary: Dictionary;
  exportSvg: () => void;
  exportDxf: () => void;
};

const SimpleSettingsButtons = ({ dictionary, exportSvg, exportDxf }: Props) => {
  return (
    <>
      <label className="mx-auto xl:mr-4 my-auto mb-2">{dictionary.calibration.export}</label>
      <div className="flex flex-row gap-4 mx-auto xl:ml-0 mx:mr-2">
        <Button
          size="medium"
          className="w-32"
          onClick={exportSvg}
          style="secondary"
        >
          <label className="cursor-pointer">
            {dictionary.calibration.exportSvg}
          </label>
        </Button>
        <Button
          size="medium"
          className="w-32"
          onClick={exportDxf}
          style="secondary"
        >
          <label className="cursor-pointer">
            {dictionary.calibration.exportDxf}
          </label>
        </Button>
      </div>
    </>
  );
};

export default SimpleSettingsButtons;
