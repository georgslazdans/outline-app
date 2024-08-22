import { Dictionary } from "@/app/dictionaries";
import ResultViewer from "./ResultViewer";
import ResultToolbar from "./ResultToolbar";
import { EditorModeConfig } from "../EditorMode";
import { ModelData } from "@/lib/replicad/ModelData";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
};

const ResultMode = ({ dictionary, modelData }: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ResultViewer
          dictionary={dictionary}
          modelData={modelData}
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
