"use client";

import React from "react";
import { Dictionary } from "@/app/dictionaries";
import { ResultProvider } from "./ResultContext";
import CalibrationComponent from "./CalibrationComponent";

type Props = {
  dictionary: Dictionary;
};

const Calibration = ({ dictionary }: Props) => {
  return (
    <>
      <ResultProvider>
        <CalibrationComponent dictionary={dictionary}></CalibrationComponent>
      </ResultProvider>
    </>
  );
};

export default Calibration;
