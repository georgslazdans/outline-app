"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import Settings from "@/lib/opencv/Settings";
import { useDetails } from "@/context/DetailsContext";
import { ReactNode } from "react";
import ExportFileButtons from "./ExportFileButtons";
import { SettingStepProvider } from "./SettingStepContext";
import { OutlineImageSelector } from "./image/OutlineImageSelector";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  openDetailedSettings: () => void;
  children: ReactNode;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  openDetailedSettings,
  children,
}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const handleSettingsChange = (updatedSettings: Settings) => {
    if (detailsContext) {
      const newDetails = { ...detailsContext, settings: updatedSettings };
      setDetailsContext(newDetails);
    }
  };

  return (
    <>
      <SettingStepProvider settings={settings}>
        <div className="flex flex-col gap-4 xl:flex-row flex-grow">
          <div className="xl:w-1/2">
            <OutlineImageSelector
              dictionary={dictionary}
              settings={settings}
            ></OutlineImageSelector>
            {children}
            <div className="hidden xl:flex flex-row gap-2 mt-3">
              <ExportFileButtons dictionary={dictionary}></ExportFileButtons>
            </div>
          </div>
          <div className="xl:h-[calc(100vh-15rem)] overflow-auto xl:w-1/2">
            <SimpleSettingsEditor
              dictionary={dictionary}
              settings={settings}
              onChange={handleSettingsChange}
              openDetailedSettings={openDetailedSettings}
            ></SimpleSettingsEditor>
            <div className="xl:hidden flex flex-col md:flex-row md:gap-2 mt-2">
              <ExportFileButtons dictionary={dictionary}></ExportFileButtons>
            </div>
          </div>
        </div>
      </SettingStepProvider>
    </>
  );
};

export default SimpleCalibration;
