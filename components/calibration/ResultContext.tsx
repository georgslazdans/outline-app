"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
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
  objectOutlineImages: ImageData[];
  paperOutlineImages: ImageData[];
  updateResult: (result: StepResult) => void;
  setStepResults: React.Dispatch<React.SetStateAction<StepResult[]>>;
  updatePaperOutlines: (paperOutlines: ImageData[]) => void;
  updateObjectOutlines: (objectOutlines: ImageData[]) => void;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const { detailsContext, contextImageData } = useDetails();
  const [stepResults, setStepResults] = useState<StepResult[]>(
    placeholderSteps(detailsContext)
  );
  const [paperOutlineImages, setPaperOutlineImages] = useState<ImageData[]>([]);
  const [objectOutlineImages, setObjectOutlineImages] = useState<ImageData[]>(
    []
  );

  const updateResult = useCallback((result: StepResult) => {
    setStepResults((previous) => {
      return previous.map((it) => {
        if (it.stepName == result.stepName) {
          return result;
        } else {
          return it;
        }
      });
    });
  }, []);

  useEffect(() => {
    const input = findStep(StepName.INPUT).in(stepResults);
    if (!input.imageData || isImageDataEmpty(input.imageData)) {
      updateResult(inputStepOf(contextImageData));
    }
  }, [contextImageData, stepResults, updateResult]);

  return (
    <ResultContext.Provider
      value={{
        stepResults: stepResults,
        objectOutlineImages: objectOutlineImages,
        paperOutlineImages: paperOutlineImages,
        updateResult: updateResult,
        setStepResults: setStepResults,
        updatePaperOutlines: setPaperOutlineImages,
        updateObjectOutlines: setObjectOutlineImages,
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
