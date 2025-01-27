"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import Settings from "@/lib/opencv/Settings";
import { useDetails } from "@/context/DetailsContext";
import { useCallback } from "react";
import Svg from "@/lib/svg/Svg";
import { downloadFile } from "@/lib/utils/Download";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import SimpleSettingsButtons from "./SimpleSettingsButtons";
import { modifyContourList } from "@/lib/data/contour/ContourPoints";
import { useResultContext } from "../ResultContext";
import { SettingStepProvider } from "./SettingStepContext";
import { OutlineImageSelector } from "./image/OutlineImageSelector";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  openAdvancedMode: () => void;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  openAdvancedMode,
}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();
  const { stepResults } = useResultContext();

  const handleSettingsChange = (updatedSettings: Settings) => {
    if (detailsContext) {
      const newDetails = { ...detailsContext, settings: updatedSettings };
      setDetailsContext(newDetails);
    }
  };

  const exportSvg = useCallback(() => {
    const lastStep = stepResults[stepResults.length - 1];
    const paperDimensions = paperDimensionsOfDetailsContext(detailsContext);
    const contours = modifyContourList(lastStep.contours!).centerPoints(
      paperDimensions
    );
    const svg = Svg.from(contours, paperDimensions);
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  }, [detailsContext, stepResults]);

  return (
    <>
      <SettingStepProvider>
        <div className="flex flex-col gap-4 xl:flex-row flex-grow">
          <div className="xl:w-1/2">
            <OutlineImageSelector
              dictionary={dictionary}
            ></OutlineImageSelector>

            <div className="hidden xl:flex flex-row gap-2 mt-3">
              <SimpleSettingsButtons
                dictionary={dictionary}
                openAdvancedMode={openAdvancedMode}
                exportSvg={exportSvg}
              ></SimpleSettingsButtons>
            </div>
          </div>
          <div className="xl:h-[calc(100vh-15rem)] overflow-auto">
            <SimpleSettingsEditor
              dictionary={dictionary}
              settings={settings}
              onChange={handleSettingsChange}
            ></SimpleSettingsEditor>
            <div className="xl:hidden flex flex-col md:flex-row md:gap-2 mt-2">
              <SimpleSettingsButtons
                dictionary={dictionary}
                openAdvancedMode={openAdvancedMode}
                exportSvg={exportSvg}
              ></SimpleSettingsButtons>
            </div>
          </div>
        </div>
      </SettingStepProvider>
    </>
  );
};

export default SimpleCalibration;
