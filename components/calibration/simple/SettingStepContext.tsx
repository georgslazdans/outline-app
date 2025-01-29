"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import CalibrationSettingStep from "./settings/CalibrationSettingStep";

type SettingStepContextType = {
  settingStep: CalibrationSettingStep;
  setSettingStep: React.Dispatch<React.SetStateAction<CalibrationSettingStep>>;
};

const SettingStepContext = createContext<SettingStepContextType | undefined>(
  undefined
);

export const SettingStepProvider = ({ children }: { children: ReactNode }) => {
  const [settingStep, setSettingStep] = useState<CalibrationSettingStep>(
    CalibrationSettingStep.FIND_PAPER
  );

  return (
    <SettingStepContext.Provider
      value={{
        settingStep,
        setSettingStep,
      }}
    >
      {children}
    </SettingStepContext.Provider>
  );
};

export const useSettingStepContext = (): SettingStepContextType => {
  const context = useContext(SettingStepContext);
  if (context === undefined) {
    throw new Error(
      "useSettingStepContext must be used within an SettingStepProvider"
    );
  }
  return context;
};
