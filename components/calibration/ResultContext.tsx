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
import { isImageDataEmpty } from "@/lib/utils/ImageData";

type ResultContextType = {
  stepResults: StepResult[];
  setStepResults: React.Dispatch<React.SetStateAction<StepResult[]>>;
  outdatedSteps: StepName[];
  setOutdatedSteps: React.Dispatch<React.SetStateAction<StepName[]>>;
  objectOutlineImages: ImageData[];
  updateObjectOutlines: (objectOutlines: ImageData[]) => void;
  paperOutlineImages: ImageData[];
  updatePaperOutlines: (paperOutlines: ImageData[]) => void;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const { detailsContext, contextImageData } = useDetails();
  const [stepResults, setStepResults] = useState<StepResult[]>(
    placeholderSteps(detailsContext)
  );
  const [outdatedSteps, setOutdatedSteps] = useState<StepName[]>([]);
  const [paperOutlineImages, setPaperOutlineImages] = useState<ImageData[]>([]);
  const [objectOutlineImages, setObjectOutlineImages] = useState<ImageData[]>(
    []
  );

  useEffect(() => {
    const input = findStep(StepName.INPUT).in(stepResults);
    if (
      contextImageData &&
      (!input.imageData || isImageDataEmpty(input.imageData))
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
