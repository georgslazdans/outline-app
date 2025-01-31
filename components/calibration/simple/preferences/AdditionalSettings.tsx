"use client";

import React from "react";
import Settings from "@/lib/opencv/Settings";
import {
  useNestedStepChangeHandler,
  useStepChangeHandler,
} from "../../fields/ChangeHandler";
import StepName from "@/lib/opencv/processor/steps/StepName";
import StepSettingField from "../../fields/StepSettingField";
import { Dictionary } from "@/app/dictionaries";
import findPaperOutlineStep from "@/lib/opencv/processor/steps/FindPaperOutline";
import extractPaperStep from "@/lib/opencv/processor/steps/ExtractPaper";
import findObjectOutlinesStep from "@/lib/opencv/processor/steps/FindObjectOutlines";
import {
  GroupConfig,
  StepSettingConfig,
} from "@/lib/opencv/processor/steps/StepSettings";
import { SettingsConfig } from "@/lib/opencv/processor/steps/ProcessingFunction";

const FILTER_SIMILAR_OUTLINES = "filterSimilarOutlines";
const SIMILARITY_THRESHOLD = "similarityThreshold";

const SHRINK_PAPER = "shrinkPaper";

const AREA_THRESHOLD_SETTINGS = "areaThresholdSettings";
const LOWER_THRESHOLD = "lowerThreshold";
const UPPER_THRESHOLD = "upperThreshold";

type Props = {
  dictionary: Dictionary;
  settings: Settings;
  onSettingsChanged: (settings: Settings) => void;
};

const AdditionalSettings = ({
  dictionary,
  settings,
  onSettingsChanged,
}: Props) => {
  const onFindPaperOutlineChange = useStepChangeHandler(
    StepName.FIND_PAPER_OUTLINE,
    settings,
    onSettingsChanged
  );
  const onExtractPaperChange = useStepChangeHandler(
    StepName.EXTRACT_PAPER,
    settings,
    onSettingsChanged
  );

  const onFindObjectOutlinesChanged = useNestedStepChangeHandler(
    StepName.FIND_OBJECT_OUTLINES,
    settings,
    onSettingsChanged
  );

  const areaThresholdConfig = (
    findObjectOutlinesStep.config![AREA_THRESHOLD_SETTINGS] as GroupConfig
  ).config;
  const areaThresholdSettings =
    settings[StepName.FIND_OBJECT_OUTLINES][AREA_THRESHOLD_SETTINGS];

  return (
    <>
      <h2 className="mb-2">Additional Settings</h2>
      <div className="mb-2">
        <h3 className="mb-2">Find Paper Outlines</h3>
        <StepSettingField
          value={settings[StepName.FIND_PAPER_OUTLINE][FILTER_SIMILAR_OUTLINES]}
          name={FILTER_SIMILAR_OUTLINES}
          config={findPaperOutlineStep.config![FILTER_SIMILAR_OUTLINES]}
          onChange={onFindPaperOutlineChange(FILTER_SIMILAR_OUTLINES)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={settings[StepName.FIND_PAPER_OUTLINE][SIMILARITY_THRESHOLD]}
          name={SIMILARITY_THRESHOLD}
          config={findPaperOutlineStep.config![SIMILARITY_THRESHOLD]}
          onChange={onFindPaperOutlineChange(SIMILARITY_THRESHOLD)}
          dictionary={dictionary}
        ></StepSettingField>
      </div>
      <div className="mb-2">
        <h3 className="mb-2">Extract Paper</h3>
        <StepSettingField
          value={settings[StepName.EXTRACT_PAPER][SHRINK_PAPER]}
          name={SHRINK_PAPER}
          config={extractPaperStep.config![SHRINK_PAPER]}
          onChange={onExtractPaperChange(SHRINK_PAPER)}
          dictionary={dictionary}
        ></StepSettingField>
      </div>
      <div className="mb-2">
        <h3 className="mb-2">Find Object Outlines</h3>
        <StepSettingField
          value={areaThresholdSettings[LOWER_THRESHOLD]}
          name={LOWER_THRESHOLD}
          config={areaThresholdConfig[LOWER_THRESHOLD]}
          onChange={onFindObjectOutlinesChanged(
            LOWER_THRESHOLD,
            "areaThresholdSettings"
          )}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={areaThresholdSettings[UPPER_THRESHOLD]}
          name={UPPER_THRESHOLD}
          config={areaThresholdConfig[UPPER_THRESHOLD]}
          onChange={onFindObjectOutlinesChanged(
            UPPER_THRESHOLD,
            "areaThresholdSettings"
          )}
          dictionary={dictionary}
        ></StepSettingField>
      </div>
    </>
  );
};

export default AdditionalSettings;
