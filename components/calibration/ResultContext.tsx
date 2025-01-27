"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import StepResult from "@/lib/opencv/StepResult";

type ResultContextType = {
  stepResults: StepResult[];
  outlineCheckImage?: ImageData;
  paperOutlineImages: ImageData[];
  updateResult: (
    results: StepResult[],
    paperOutlines: ImageData[],
    outline?: ImageData,
  ) => void;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [outlineCheckImage, setOutlineCheckImage] = useState<ImageData>();
  const [paperOutlineImages, setPaperOutlineImages] = useState<ImageData[]>([]);

  const updateResult = (
    results: StepResult[],
    paperOutlines: ImageData[],
    outline?: ImageData,
  ) => {
    setStepResults(results);
    setPaperOutlineImages(paperOutlines);
    setOutlineCheckImage(outline);
  };

  return (
    <ResultContext.Provider
      value={{
        stepResults,
        outlineCheckImage,
        paperOutlineImages,
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
