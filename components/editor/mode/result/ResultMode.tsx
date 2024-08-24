import { Dictionary } from "@/app/dictionaries";
import ResultViewer from "./ResultViewer";
import ResultToolbar from "./ResultToolbar";
import { EditorModeConfig } from "../EditorMode";

type Props = {
  dictionary: Dictionary;
};

const ResultMode = ({ dictionary }: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ResultViewer
          dictionary={dictionary}
        ></ResultViewer>
      );
    },
    toolbar: () => {
      return (
        <ResultToolbar
          dictionary={dictionary}
        ></ResultToolbar>
      );
    },
  };
  return mode;
};

export default ResultMode;
