import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../../EditorMode";
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
  selectedPoint?: ContourIndex
  setSelectedPoint: (index: ContourIndex) => void;
};

const ContourMode = ({
  dictionary,
  modelData,
  onModelDataChange,
  selectedId,
  setDisableCamera,
  selectedPoint,
  setSelectedPoint
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
        ></ContourModeToolbar>
      );
    },
  };
  return mode;
};

export default ContourMode;
