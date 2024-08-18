import { Dictionary } from "@/app/dictionaries";
import EditorMode, { EditorModeConfig } from "../../EditorMode";
import ContourModeEdit from "./ContourModeEdit";
import { ModelData } from "@/lib/replicad/Work";
import ContourModeToolbar from "./ContourModeToolbar";
import ContourIndex from "./ContourIndex";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData) => void;
  selectedId?: string;
  setDisableCamera: (value: boolean) => void;
  selectedPoint?: ContourIndex;
  setSelectedPoint: (index: ContourIndex) => void;
  setEditorMode: (mode: EditorMode) => void;
};

const ContourMode = ({
  dictionary,
  modelData,
  onModelDataChange,
  selectedId,
  setDisableCamera,
  selectedPoint,
  setSelectedPoint,
  setEditorMode,
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <ContourModeEdit
          dictionary={dictionary}
          modelData={modelData}
          onModelDataChange={onModelDataChange}
          selectedId={selectedId}
          setDisableCamera={setDisableCamera}
          selectedPoint={selectedPoint}
          onPointSelect={setSelectedPoint}
        ></ContourModeEdit>
      );
    },
    toolbar: () => {
      return (
        <ContourModeToolbar
          dictionary={dictionary}
          modelData={modelData}
          selectedId={selectedId}
          selectedPoint={selectedPoint}
          onModelDataChange={onModelDataChange}
          onDone={() => setEditorMode(EditorMode.EDIT)}
        ></ContourModeToolbar>
      );
    },
  };
  return mode;
};

export default ContourMode;
