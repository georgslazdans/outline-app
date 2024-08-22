import EditorHistoryType from "./EditorHistoryType";

type EditHistoryOptions = {
  type: EditorHistoryType;
  itemId?: string;
  addDate: Date;
};

export default EditHistoryOptions;
