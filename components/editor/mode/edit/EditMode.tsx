import { Dictionary } from "@/app/dictionaries";
import EditorMode, { EditorModeConfig } from "../EditorMode";
import EditCanvas from "./EditCanvas";
import EditToolbar from "./EditToolbar";
import { ModelData } from "@/lib/replicad/ModelData";
import EditorHistoryType from "../../EditorHistoryType";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: (model: ModelData, type: EditorHistoryType) => void;
};

const EditMode = ({
  dictionary,
  modelData,
  setModelData
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <EditCanvas
          dictionary={dictionary}
          modelData={modelData}
          onModelDataChange={setModelData}
        ></EditCanvas>
      );
    },
    toolbar: () => {
      return (
        <EditToolbar
          dictionary={dictionary}
          modelData={modelData}
          onModelDataUpdate={setModelData}
        ></EditToolbar>
      );
    },
  };
  return mode;
};

export default EditMode;
