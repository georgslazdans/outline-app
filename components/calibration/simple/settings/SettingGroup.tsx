import { Dictionary } from "@/app/dictionaries";
import { ReactNode, useCallback } from "react";
import CalibrationSettingStep from "./CalibrationSettingStep";
import IconButton from "@/components/IconButton";
import { useSettingStepContext } from "../SettingStepContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useResultContext } from "../../ResultContext";

type Props = {
  name: string;
  dictionary: Dictionary;
  children: ReactNode;
  settingStep: CalibrationSettingStep;
};

const SettingGroup = ({ name, dictionary, children, settingStep }: Props) => {
  const { paperOutlineImages, outlineCheckImage } = useResultContext();
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

  const isDisabled = useCallback((): boolean => {
    if (settingStep == CalibrationSettingStep.FIND_PAPER) {
      return false;
    }
    if (
      settingStep == CalibrationSettingStep.HOLE_SETTINGS ||
      settingStep == CalibrationSettingStep.SMOOTHING
    ) {
      if (!outlineCheckImage) {
        return true;
      }
    }
    return paperOutlineImages.length <= 0;
  }, [outlineCheckImage, paperOutlineImages.length, settingStep]);

  return (
    <>
      <div
        className={
          "flex flex-row h-10 " +
          (!expanded && !isDisabled()
            ? " hover:bg-gray hover:text-black"
            : "mb-1") +
          (isDisabled() ? " text-gray " : "")
        }
        onClick={!isDisabled() ? onStepSelected : () => {}}
      >
        <h3 className="my-auto">{settingLabel(name)}</h3>
        {!expanded && !isDisabled() ? (
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
