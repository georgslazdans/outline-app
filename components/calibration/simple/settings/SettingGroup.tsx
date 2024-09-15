import { Dictionary } from "@/app/dictionaries";
import { ReactNode } from "react";

type Props = {
  name: string;
  dictionary: Dictionary;
  children: ReactNode;
};

const SettingGroup = ({ name, dictionary, children }: Props) => {
  const settingLabel = (name: string) => {
    //@ts-ignore
    return dictionary.calibration.simpleSettings[name];
  };

  return (
    <>
      <h3>{settingLabel(name)}</h3>
      {children}
    </>
  );
};

export default SettingGroup;
