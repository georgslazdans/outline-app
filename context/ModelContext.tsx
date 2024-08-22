"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Model from "@/lib/Model";
import { defaultGridfinityParams } from "@/lib/replicad/GridfinityParams";
import { gridfinityItemOf } from "@/lib/replicad/Model";

type ModelContextType = {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const defaultModel = {
    name: "Untitled",
    modelData: { items: [gridfinityItemOf(defaultGridfinityParams())] },
    addDate: new Date(),
  };
  const [model, setModel] = useState<Model>(defaultModel);

  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
