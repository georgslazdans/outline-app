import Orientation from "../Orientation";
import Settings from "./Settings";
import StepName from "./processor/steps/StepName";

type PaperSettings = {
  width: number;
  height: number;
  orientation: Orientation;
};

export type PaperDimensions = {
  width: number;
  height: number;
};

export const paperDimensionsOf = (
  paperSettings: PaperSettings
): PaperDimensions => {
  return {
    width: paperWidthOf(paperSettings),
    height: paperHeightOf(paperSettings),
  };
};

const paperWidthOf = (paperSettings: PaperSettings) => {
  return paperSettings.orientation == Orientation.PORTRAIT
    ? paperSettings.width
    : paperSettings.height;
};

const paperHeightOf = (paperSettings: PaperSettings) => {
  return paperSettings.orientation == Orientation.PORTRAIT
    ? paperSettings.height
    : paperSettings.width;
};

export const paperSettingsOf = (settings: Settings): PaperSettings => {
  return settings[StepName.EXTRACT_PAPER].paperSettings;
};

export default PaperSettings;
