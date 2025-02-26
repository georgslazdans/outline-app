import { Context } from "@/context/DetailsContext";
import Settings, { settingsOf } from "./Settings";
import { ProcessStep } from "./processor/ProcessStep";
import { ProcessAll } from "./processor/ProcessAll";
import StepName from "./processor/steps/StepName";

export const allWorkOf = (
  context: Context,
  contextImageData: ImageData
): ProcessAll => {
  const imageData =
    contextImageData ||
    (typeof window !== "undefined" ? new ImageData(1, 1) : null);

  return {
    imageData: imageData,
    settings: settingsOf(context),
  };
};

export const stepWorkOf = (
  stepName: string,
  settings: Settings
): ProcessStep => {
  return {
    stepName: stepName as StepName,
    settings: settings,
  };
};
