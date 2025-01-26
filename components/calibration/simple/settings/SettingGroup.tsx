import { Dictionary } from "@/app/dictionaries";
import { ReactNode } from "react";
import CalibrationSettingStep from "./CalibrationSettingStep";
import IconButton from "@/components/IconButton";
import { useSettingStepContext } from "../SettingStepContext";

type Props = {
  name: string;
  dictionary: Dictionary;
  children: ReactNode;
  settingStep: CalibrationSettingStep;
};

const SettingGroup = ({ name, dictionary, children, settingStep }: Props) => {
  const {
    settingStep: currentSettingStep,
    setSettingStep: setCurrentSettingStep,
  } = useSettingStepContext();
  const expanded = currentSettingStep == settingStep;

  const settingLabel = (name: string) => {
    //@ts-ignore
    return dictionary.calibration.simpleSettings[name];
  };

  const onStepSelected = () => {
    setCurrentSettingStep(settingStep);
  };

  return (
    <>
      <div className="flex flex-row">
        <h3>{settingLabel(name)}</h3>
        {/* TODO add plus Icon based on visibility */}
        {!expanded ? (
          <IconButton
            className="ml-auto w-10 justify-center font-bold text-2xl"
            onClick={onStepSelected}
          >
            <span>+</span>
          </IconButton>
        ) : null}
      </div>
      {expanded ? children : null}
    </>
  );
};

export default SettingGroup;
