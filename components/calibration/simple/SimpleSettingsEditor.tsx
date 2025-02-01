import Settings from "@/lib/opencv/Settings";
import { Dictionary } from "@/app/dictionaries";
import FindPaperSettings from "./settings/FindPaperSettings";
import CloseCornerSettings from "./settings/CloseCornersSettings";
import HoleAndSmoothSettings from "./settings/HoleSettings";
import FindObjectSettings from "./settings/FindObjectSettings";
import FilterObjectOutlines from "./settings/FilterObjectOutlines";
import PreferencesModal from "./preferences/PreferencesModal";
import IconButton from "@/components/IconButton";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/solid";
import OpenDetailedSettings from "./preferences/OpenDetailedSettings";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onChange: (settings: Settings) => void;
  openDetailedSettings: () => void;
};

const SimpleSettingsEditor = ({
  dictionary,
  settings,
  onChange,
  openDetailedSettings,
}: Props) => {
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
        <div className="mr-2 flex flex-row gap-1">
          <OpenDetailedSettings
            dictionary={dictionary}
            openDetailedSettings={openDetailedSettings}
          ></OpenDetailedSettings>
          <PreferencesModal
            dictionary={dictionary}
            settings={settings}
            onSettingsChanged={onChange}
          ></PreferencesModal>
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
