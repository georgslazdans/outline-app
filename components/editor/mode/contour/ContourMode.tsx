import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../EditorMode";
import ContourModeEdit from "./ContourModeEdit";
import ContourModeToolbar from "./ContourModeToolbar";
import ModelData from "@/lib/replicad/model/ModelData";
import { UpdateModelData } from "../../EditorComponent";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const ContourMode = ({
  dictionary,
  modelData,
  setModelData,
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ContourModeEdit
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></ContourModeEdit>
      );
    },
    toolbar: () => {
      return (
        <ContourModeToolbar
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></ContourModeToolbar>
      );
    },
  };
  return mode;
};

export default ContourMode;
