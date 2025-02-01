"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/solid";
import IconButton from "@/components/IconButton";
import { Tooltip } from "react-tooltip";

type Props = {
  dictionary: Dictionary;
  openDetailedSettings: () => void;
};

const OPEN_DETAILED_SETTINGS = "open-detailed-settings";

const OpenDetailedSettings = ({ dictionary, openDetailedSettings }: Props) => {
  return (
    <>
      <IconButton
        id={OPEN_DETAILED_SETTINGS}
        className="w-12 h-12"
        onClick={openDetailedSettings}
      >
        <DocumentMagnifyingGlassIcon></DocumentMagnifyingGlassIcon>
      </IconButton>

      <Tooltip anchorSelect={"#" + OPEN_DETAILED_SETTINGS} place="top">
        {dictionary.calibration.advancedSettings}
      </Tooltip>
    </>
  );
};

export default OpenDetailedSettings;
