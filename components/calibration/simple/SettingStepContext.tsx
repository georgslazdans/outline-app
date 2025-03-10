"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import CalibrationSettingStep from "./settings/CalibrationSettingStep";
import Settings, { inSettings } from "@/lib/opencv/Settings";

type SettingStepContextType = {
  settingStep: CalibrationSettingStep;
  setSettingStep: React.Dispatch<React.SetStateAction<CalibrationSettingStep>>;
};

const SettingStepContext = createContext<SettingStepContextType | undefined>(
  undefined
);

type Props = {
  settings: Settings;
  children: ReactNode;
};

export const SettingStepProvider = ({ settings, children }: Props) => {
  const [settingStep, setSettingStep] = useState<CalibrationSettingStep>(
    inSettings(settings).isPaperDetectionSkipped()
      ? CalibrationSettingStep.FIND_OBJECT
      : CalibrationSettingStep.FIND_PAPER
  );

  useEffect(() => {
    if (
      (settingStep == CalibrationSettingStep.FIND_PAPER ||
        settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER) &&
      inSettings(settings).isPaperDetectionSkipped()
    ) {
      setSettingStep(CalibrationSettingStep.FIND_OBJECT);
    }
  }, [settings, settingStep]);

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
