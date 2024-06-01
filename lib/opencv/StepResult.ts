export type StepResult = {
    stepName: string,
    imageData: ImageData,
    debugSteps?: StepResult[]
}

export default StepResult;