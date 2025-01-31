import Settings from "@/lib/opencv/Settings";
import { Dictionary } from "@/app/dictionaries";
import FindPaperSettings from "./settings/FindPaperSettings";
import CloseCornerSettings from "./settings/CloseCornersSettings";
import HoleAndSmoothSettings from "./settings/HoleSettings";
import FindObjectSettings from "./settings/FindObjectSettings";
import FilterObjectOutlines from "./settings/FilterObjectOutlines";
import IconButton from "@/components/IconButton";
import PreferencesModal from "./preferences/PreferencesModal";

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
      <div className="flex flex-row mb-2">
        <div className="grow">
          <h2 className="text-center p-2">
            {dictionary.calibration.simpleSettings.title}
          </h2>
        </div>
        <div className="mr-2">
          <PreferencesModal dictionary={dictionary}></PreferencesModal>
        </div>
      </div>

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
        <HoleAndSmoothSettings
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        />
        <FilterObjectOutlines
          dictionary={dictionary}
          settings={settings}
          onSettingsChange={onChange}
        ></FilterObjectOutlines>
      </div>
    </div>
  );
};

export default SimpleSettingsEditor;
