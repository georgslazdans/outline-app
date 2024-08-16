import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import { useState } from "react";
import ResultViewer from "./ResultViewer";
import ResultToolbar from "./ResultToolbar";
import { EditorModeConfig } from "../../EditorMode";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  wireframe: boolean;
};

const ResultMode = ({
  dictionary,
  modelData,
  wireframe,
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ResultViewer
          dictionary={dictionary}
          modelData={modelData}
          wireframe={wireframe}
        ></ResultViewer>
      );
    },
    toolbar: () => {
      return (
        <ResultToolbar
          dictionary={dictionary}
          modelData={modelData}
        ></ResultToolbar>
      );
    },
  };
  return mode;
};

export default ResultMode;
