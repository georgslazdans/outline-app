import StepName from "./steps/StepName";

export type StepResult = {
    stepName: StepName,
    imageData: ImageData,
    debugSteps?: StepResult[]
}

export default StepResult;