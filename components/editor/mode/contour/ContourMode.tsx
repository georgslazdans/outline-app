import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../EditorMode";
import ContourModeEdit from "./ContourModeEdit";
import ContourModeToolbar from "./ContourModeToolbar";
import ModelData from "@/lib/replicad/model/ModelData";

type Props = {
  dictionary: Dictionary;
};

const ContourMode = ({
  dictionary
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ContourModeEdit
          dictionary={dictionary}
        ></ContourModeEdit>
      );
    },
    toolbar: () => {
      return (
        <ContourModeToolbar
          dictionary={dictionary}
        ></ContourModeToolbar>
      );
    },
  };
  return mode;
};

export default ContourMode;
