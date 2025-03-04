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
import { GroupConfig } from "@/lib/opencv/processor/steps/StepSettings";
import StepSettingGroup from "../../fields/StepSettingGroup";
import bilateralFilterStep from "@/lib/opencv/processor/steps/BilateralFilter";
import { INPUT } from "@/lib/opencv/processor/Steps";

const SKIP_PAPER_DETECTION = "skipPaperDetection";

const FILTER_SIMILAR_OUTLINES = "filterSimilarOutlines";
const SIMILARITY_THRESHOLD = "similarityThreshold";

const SHRINK_PAPER = "shrinkPaper";
const PAPER_SETTINGS = "paperSettings";

const AREA_THRESHOLD_SETTINGS = "areaThresholdSettings";
const LOWER_THRESHOLD = "lowerThreshold";
const UPPER_THRESHOLD = "upperThreshold";

const DISABLED_BILATERAL_FILTER = "disabledBilateralFilter";
const REUSE_STEP = "reuseStep";

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
  const onDisablePaperDetectionChange = useStepChangeHandler(
    StepName.INPUT,
    settings,
    onSettingsChanged
  );

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

  const onBilateralFilterChanged = useStepChangeHandler(
    StepName.BILATERAL_FILTER,
    settings,
    onSettingsChanged
  );

  const paperConfig = (extractPaperStep.config![PAPER_SETTINGS] as GroupConfig)
    .config;
  const paperSettings = settings[StepName.EXTRACT_PAPER][PAPER_SETTINGS];

  const areaThresholdConfig = (
    findObjectOutlinesStep.config![AREA_THRESHOLD_SETTINGS] as GroupConfig
  ).config;
  const areaThresholdSettings =
    settings[StepName.FIND_OBJECT_OUTLINES][AREA_THRESHOLD_SETTINGS];

  return (
    <>
      <h2 className="mb-2">Additional Settings</h2>
      <div className="mb-4">
        <h3 className="mb-2">Find Paper Outlines</h3>
        <StepSettingField
          value={settings[StepName.INPUT][SKIP_PAPER_DETECTION]}
          name={SKIP_PAPER_DETECTION}
          config={INPUT.config![SKIP_PAPER_DETECTION]}
          onChange={onDisablePaperDetectionChange(SKIP_PAPER_DETECTION)}
          dictionary={dictionary}
        ></StepSettingField>
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
      <div className="mb-4">
        <h3 className="mb-2">Extract Paper</h3>
        <StepSettingField
          value={settings[StepName.EXTRACT_PAPER][SHRINK_PAPER]}
          name={SHRINK_PAPER}
          config={extractPaperStep.config![SHRINK_PAPER]}
          onChange={onExtractPaperChange(SHRINK_PAPER)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingGroup
          name={PAPER_SETTINGS}
          settings={paperSettings}
          settingsConfig={paperConfig}
          onChange={onExtractPaperChange(PAPER_SETTINGS)}
          dictionary={dictionary}
          stepName={StepName.EXTRACT_PAPER}
          allSettings={settings}
        ></StepSettingGroup>
      </div>
      <div className="mb-4">
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
      <div className="mb-4">
        <h3 className="mb-2">Disable Steps</h3>
        <StepSettingField
          value={settings[StepName.BILATERAL_FILTER][DISABLED_BILATERAL_FILTER]}
          name={DISABLED_BILATERAL_FILTER}
          config={bilateralFilterStep.config![DISABLED_BILATERAL_FILTER]}
          onChange={onBilateralFilterChanged(DISABLED_BILATERAL_FILTER)}
          dictionary={dictionary}
        ></StepSettingField>
        <StepSettingField
          value={settings[StepName.EXTRACT_PAPER][REUSE_STEP]}
          name={REUSE_STEP}
          config={extractPaperStep.config![REUSE_STEP]}
          onChange={onExtractPaperChange(REUSE_STEP)}
          dictionary={dictionary}
        ></StepSettingField>
      </div>
    </>
  );
};

export default AdditionalSettings;
