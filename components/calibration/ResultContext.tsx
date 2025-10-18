"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import StepResult, {
  findStep,
  inputStepOf,
  placeholderSteps,
} from "@/lib/opencv/StepResult";
import { useDetails } from "@/context/DetailsContext";
import StepName from "@/lib/opencv/processor/steps/StepName";

type ResultContextType = {
  stepResults: StepResult[];
  setStepResults: React.Dispatch<React.SetStateAction<StepResult[]>>;
  outdatedSteps: StepName[];
  setOutdatedSteps: React.Dispatch<React.SetStateAction<StepName[]>>;
  objectOutlineImages: ArrayBuffer[];
  updateObjectOutlines: (objectOutlines: ArrayBuffer[]) => void;
  paperOutlineImages: ArrayBuffer[];
  updatePaperOutlines: (paperOutlines: ArrayBuffer[]) => void;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const { detailsContext, contextImagePng: contextImageData } = useDetails();
  const [stepResults, setStepResults] = useState<StepResult[]>(
    placeholderSteps(detailsContext)
  );
  const [outdatedSteps, setOutdatedSteps] = useState<StepName[]>([]);
  const [paperOutlineImages, setPaperOutlineImages] = useState<ArrayBuffer[]>([]);
  const [objectOutlineImages, setObjectOutlineImages] = useState<ArrayBuffer[]>(
    []
  );

  useEffect(() => {
    const input = findStep(StepName.INPUT).in(stepResults);
    if (
      contextImageData &&
      (!input.pngBuffer || input.pngBuffer.byteLength == 0)
    ) {
      setStepResults((previous) => {
        return previous.map((it) => {
          if (it.stepName == StepName.INPUT) {
            return inputStepOf(contextImageData);
          } else {
            return it;
          }
        });
      });
    }
  }, [contextImageData, stepResults]);

  return (
    <ResultContext.Provider
      value={{
        stepResults: stepResults,
        setStepResults: setStepResults,

        outdatedSteps: outdatedSteps,
        setOutdatedSteps: setOutdatedSteps,

        objectOutlineImages: objectOutlineImages,
        updateObjectOutlines: setObjectOutlineImages,

        paperOutlineImages: paperOutlineImages,
        updatePaperOutlines: setPaperOutlineImages,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = (): ResultContextType => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error("useResultContext must be used within an ResultProvider");
  }
  return context;
};
