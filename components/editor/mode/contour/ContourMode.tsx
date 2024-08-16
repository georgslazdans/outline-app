import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../../EditorMode";
import ContourModeEdit from "./ContourModeEdit";
import { ModelData } from "@/lib/replicad/Work";
import ContourModeToolbar from "./ContourModeToolbar";
import ContourIndex from "./ContourIndex";
import { useState } from "react";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData) => void;
  selectedId?: string;
  setDisableCamera: (value: boolean) => void;
};

const ContourMode = ({
  dictionary,
  modelData,
  onModelDataChange,
  selectedId,
  setDisableCamera,
}: Props): EditorModeConfig => {
  const [selectedPoint, setSelectedPoint] = useState<ContourIndex>();

  const mode = {
    view: () => {
      return (
        <ContourModeEdit
          dictionary={dictionary}
          modelData={modelData}
          onModelDataChange={onModelDataChange}
          selectedId={selectedId}
          setDisableCamera={setDisableCamera}
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
