import ContourIndex from "../mode/contour/ContourIndex";
import EditorHistoryType from "./EditorHistoryType";

type EditHistoryOptions = {
  type: EditorHistoryType;
  itemId?: string;
  addDate: Date;
  selectedId?: string;
  selectedPoint?: ContourIndex;
};

export default EditHistoryOptions;
