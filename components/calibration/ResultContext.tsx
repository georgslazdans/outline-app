"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import StepResult from "@/lib/opencv/StepResult";

type ResultContextType = {
  stepResults: StepResult[];
  objectOutlineImages: ImageData[];
  paperOutlineImages: ImageData[];
  updateResult: (
    results: StepResult[],
    paperOutlines: ImageData[],
    objectOutlines: ImageData[]
  ) => void;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [paperOutlineImages, setPaperOutlineImages] = useState<ImageData[]>([]);
  const [objectOutlineImages, setObjectOutlineImages] = useState<ImageData[]>(
    []
  );

  const updateResult = (
    results: StepResult[],
    paperOutlines: ImageData[],
    objectOutlines: ImageData[]
  ) => {
    setStepResults(results);
    setPaperOutlineImages(paperOutlines);
    setObjectOutlineImages(objectOutlines);
  };

  return (
    <ResultContext.Provider
      value={{
        stepResults: stepResults,
        objectOutlineImages: objectOutlineImages,
        paperOutlineImages: paperOutlineImages,
        updateResult: updateResult,
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
