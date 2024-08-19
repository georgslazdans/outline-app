import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import EditorMode, { EditorModeConfig } from "../../EditorMode";
import EditCanvas from "./EditCanvas";
import EditToolbar from "./EditToolbar";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: (model: ModelData) => void;
  wireframe: boolean;
  selectedId?: string;
  setSelectedId: (id: string) => void;
  setEditorMode: (mode: EditorMode) => void;
};

const EditMode = ({
  dictionary,
  modelData,
  setModelData,
  selectedId,
  setSelectedId,
  wireframe,
  setEditorMode,
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <EditCanvas
          dictionary={dictionary}
          modelData={modelData}
          onModelDataChange={setModelData}
          wireframe={wireframe}
          selectedId={selectedId}
          onModelIdSelect={setSelectedId}
        ></EditCanvas>
      );
    },
    toolbar: () => {
      return (
        <EditToolbar
          dictionary={dictionary}
          modelData={modelData}
          onModelDataUpdate={setModelData}
          selectedId={selectedId}
          onModelIdSelect={setSelectedId}
          onEditContour={() => setEditorMode(EditorMode.CONTOUR_EDIT)}
        ></EditToolbar>
      );
    },
  };
  return mode;
};

export default EditMode;
