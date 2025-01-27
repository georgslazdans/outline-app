import { Dictionary } from "@/app/dictionaries";
import { ReactNode } from "react";
import CalibrationSettingStep from "./CalibrationSettingStep";
import IconButton from "@/components/IconButton";
import { useSettingStepContext } from "../SettingStepContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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
      <div
        className={"flex flex-row " + (!expanded ? " hover:bg-gray " : "")}
        onClick={onStepSelected}
      >
        <h3>{settingLabel(name)}</h3>
        {!expanded ? (
          <IconButton
            className="ml-auto w-10 justify-center font-bold text-2xl"
            onClick={onStepSelected}
          >
            <ChevronDownIcon />
          </IconButton>
        ) : null}
      </div>
      {expanded ? children : null}
    </>
  );
};

export default SettingGroup;
