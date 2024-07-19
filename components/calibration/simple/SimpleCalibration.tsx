"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import Settings from "@/lib/opencv/Settings";
import Button from "../../Button";
import { useDetails } from "@/context/DetailsContext";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useCallback, useState } from "react";
import Svg from "@/lib/Svg";
import StepResult from "@/lib/opencv/StepResult";
import { downloadFile } from "@/lib/utils/Download";
import { OutlineImageViewer } from "./OutlineImageViewer";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import { centerPoints } from "@/lib/Point";
import SelectField from "@/components/fiields/SelectField";
import CheckboxField from "@/components/fiields/CheckboxField";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  openAdvancedMode: () => void;
  stepResults: StepResult[];
  outlineCheckImage?: ImageData;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  openAdvancedMode,
  stepResults,
  outlineCheckImage,
}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const handleSettingsChange = (updatedSettings: Settings) => {
    if (detailsContext) {
      const newDetails = { ...detailsContext, settings: updatedSettings };
      setDetailsContext(newDetails);
    }
  };

  const exportSvg = useCallback(() => {
    const lastStep = stepResults[stepResults.length - 1];
    const paperDimensions = paperDimensionsOfDetailsContext(detailsContext);
    const contours = lastStep.contours!.map((it) =>
      centerPoints(it, paperDimensions)
    );
    const svg = Svg.from(contours, paperDimensions);
    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });
    downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
  }, [detailsContext, stepResults]);

  const [backgroundImageStepName, setBackgroundImageStepName] = useState(
    StepName.ADAPTIVE_THRESHOLD
  );
  const [drawOutlines, setDrawOutlines] = useState(true);
  const backgroundImageStep = stepResults.find(
    (it) => it.stepName == backgroundImageStepName
  );

  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row flex-grow">
        <div className="xl:w-1/2">
          <div className="flex flex-row mb-2">
            <SelectField
              label={"Bakcground Image"}
              name={"background-image"}
              value={backgroundImageStepName}
              options={[
                {
                  label: dictionary.calibration.step[StepName.INPUT],
                  value: StepName.INPUT,
                },
                {
                  label: dictionary.calibration.step[StepName.BLUR],
                  value: StepName.BLUR,
                },
                {
                  label:
                    dictionary.calibration.step[StepName.ADAPTIVE_THRESHOLD],
                  value: StepName.ADAPTIVE_THRESHOLD,
                },
              ]}
              onChange={(event) =>
                setBackgroundImageStepName(event.target.value)
              }
            ></SelectField>
            <CheckboxField
              label={"Draw outlines"}
              name={"draw-outline"}
              value={drawOutlines}
              onChange={(event) => setDrawOutlines(event.target.checked)}
            ></CheckboxField>
          </div>
          <OutlineImageViewer
            className="max-h-[30vh] xl:max-h-[45vh]"
            baseImage={backgroundImageStep?.imageData}
            outlineImage={outlineCheckImage}
            drawOutline={drawOutlines}
          ></OutlineImageViewer>
        </div>
        <SimpleSettingsEditor
          dictionary={dictionary}
          settings={settings}
          onChange={handleSettingsChange}
        ></SimpleSettingsEditor>
      </div>

      <div className="flex flex-col mt-4">
        <Button onClick={() => openAdvancedMode()} style="secondary">
          <label>{dictionary.calibration.advancedSettings}</label>
        </Button>
        <Button className="mt-2" onClick={exportSvg} style="secondary">
          <label>{dictionary.calibration.exportSvg}</label>
        </Button>
      </div>
    </>
  );
};

export default SimpleCalibration;
