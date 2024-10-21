import { Dictionary } from "@/app/dictionaries";
import ResultViewer from "./ResultViewer";
import ResultToolbar from "./ResultToolbar";
import { EditorModeConfig } from "../EditorMode";
import { ResultContextProvider } from "./ResultContext";

type Props = {
  dictionary: Dictionary;
};

const ResultMode = ({ dictionary }: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return <ResultViewer dictionary={dictionary}></ResultViewer>;
    },
    toolbar: () => {
      return <ResultToolbar dictionary={dictionary}></ResultToolbar>;
    },
    contextProvider: (children: JSX.Element) => {
      return <ResultContextProvider>{children}</ResultContextProvider>;
    },
  };
  return mode;
};

export default ResultMode;
