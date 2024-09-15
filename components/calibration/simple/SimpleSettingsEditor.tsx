import Settings from "@/lib/opencv/Settings";
import { Dictionary } from "@/app/dictionaries";
import FindPaperSettings from "./settings/FindPaperSettings";
import CloseCornerSettings from "./settings/CloseCornersSettings";
import HoleSettings from "./settings/HoleSettings";
import FindObjectSettings from "./settings/FindObjectSettings";
import SmoothContourSettings from "./settings/SmoothContourSettings";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onChange: (settings: Settings) => void;
};

const SimpleSettingsEditor = ({ dictionary, settings, onChange }: Props) => {
  if (!settings) {
    return <></>;
  }

  return (
    <div>
      <h2 className="text-center p-2">
        {dictionary.calibration.simpleSettings.title}
      </h2>
      <div>
        <FindPaperSettings
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        />
        <FindObjectSettings
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        ></FindObjectSettings>
        <CloseCornerSettings
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        />
        <HoleSettings
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        />
        <SmoothContourSettings
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        ></SmoothContourSettings>
      </div>
    </div>
  );
};

export default SimpleSettingsEditor;
