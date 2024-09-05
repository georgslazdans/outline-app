"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type ModelLoadingIndicatorContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const ModelLoadingIndicatorContext = createContext<
  ModelLoadingIndicatorContextType | undefined
>(undefined);

export const ModelLoadingIndicatorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ModelLoadingIndicatorContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ModelLoadingIndicatorContext.Provider>
  );
};

export const useModelLoadingIndicatorContext =
  (): ModelLoadingIndicatorContextType => {
    const context = useContext(ModelLoadingIndicatorContext);
    if (context === undefined) {
      throw new Error(
        "useModelLoadingIndicatorContext must be used within an ModelLoadingIndicatorProvider"
      );
    }
    return context;
  };
