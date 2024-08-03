"use client";

import { Dictionary } from "@/app/dictionaries";
import SimpleSettingsEditor from "./SimpleSettingsEditor";
import Settings from "@/lib/opencv/Settings";
import { useDetails } from "@/context/DetailsContext";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { useCallback, useEffect, useState } from "react";
import Svg from "@/lib/svg/Svg";
import StepResult from "@/lib/opencv/StepResult";
import { downloadFile } from "@/lib/utils/Download";
import { OutlineImageViewer } from "./OutlineImageViewer";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import { centerPoints } from "@/lib/Point";
import SelectField from "@/components/fiields/SelectField";
import SimpleSettingsButtons from "./SimpleSettingsButtons";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  openAdvancedMode: () => void;
  stepResults: StepResult[];
  outlineCheckImage?: ImageData;
  thresholdCheckImage?: ImageData;
};

const SimpleCalibration = ({
  dictionary,
  settings,
  openAdvancedMode,
  stepResults,
  outlineCheckImage,
  thresholdCheckImage,
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
    StepName.INPUT
  );
  const [backgroundImageStep, setBackgroundImageStep] = useState<StepResult>();

  useEffect(() => {
    const backgroundImageOf = (stepName: StepName): StepResult => {
      let step = stepResults.find((it) => it.stepName == stepName)!;
      if (stepName == StepName.OBJECT_THRESHOLD) {
        step = { ...step!, imageData: thresholdCheckImage! };
      }
      return step;
    };

    setBackgroundImageStep(backgroundImageOf(backgroundImageStepName));
  }, [backgroundImageStepName, stepResults, thresholdCheckImage]);

  const backgroundImageOptions = () => {
    const options = [
      {
        label: dictionary.calibration.step[StepName.INPUT],
        value: StepName.INPUT,
      },
      {
        label: dictionary.calibration.step[StepName.BLUR],
        value: StepName.BLUR,
      },
      {
        label: dictionary.calibration.step[StepName.ADAPTIVE_THRESHOLD],
        value: StepName.ADAPTIVE_THRESHOLD,
      },
      {
        label: dictionary.calibration.step[StepName.OBJECT_THRESHOLD],
        value: StepName.OBJECT_THRESHOLD,
      },
    ];
    const stepResultNames = stepResults.map((it) => it.stepName);
    return options.filter((it) => stepResultNames.includes(it.value));
  };
  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row flex-grow">
        <div className="xl:w-1/2">
          <div className="mb-2">
            <SelectField
              label={"Bakcground Image"}
              name={"background-image"}
              value={backgroundImageStepName}
              options={backgroundImageOptions()}
              onChange={(event) =>
                setBackgroundImageStepName(event.target.value)
              }
            ></SelectField>
          </div>
          <OutlineImageViewer
            className="max-h-[30vh] xl:max-h-[45vh]"
            baseImage={backgroundImageStep?.imageData}
            outlineImage={outlineCheckImage}
          ></OutlineImageViewer>

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
    </>
  );
};

export default SimpleCalibration;
