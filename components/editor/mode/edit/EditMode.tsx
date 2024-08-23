import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../EditorMode";
import EditCanvas from "./EditCanvas";
import EditToolbar from "./EditToolbar";
import ModelData from "@/lib/replicad/model/ModelData";
import { UpdateModelData } from "../../EditorComponent";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const EditMode = ({
  dictionary,
  modelData,
  setModelData,
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <EditCanvas
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></EditCanvas>
      );
    },
    toolbar: () => {
      return (
        <EditToolbar
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></EditToolbar>
      );
    },
  };
  return mode;
};

export default EditMode;
