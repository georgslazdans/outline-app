import ModelData from "@/lib/replicad/ModelData";
import EditHistoryOptions from "./EditHistoryOptions";
import EditorHistoryType from "./EditorHistoryType";

type HistoryData = ModelData & {
  options: EditHistoryOptions;
};

export const historyDataOf = (
  data: ModelData,
  options: EditHistoryOptions
): HistoryData => {
  const historyItems = data.items.map((it) => {
    return { ...it };
  });
  return { items: historyItems, options };
};

const TIME_TO_OLD = 1.5 * 1000;
const isTooOld = (data: HistoryData): boolean => {
  const currentTime = new Date().getTime();
  const dataTime = data.options.addDate.getTime();
  return currentTime > dataTime + TIME_TO_OLD;
};

export const supportsHistoryCompression = (
  historyData: HistoryData,
  currentItem: HistoryData
) => {
  const supportedTypes = [
    EditorHistoryType.TRANSLATION,
    EditorHistoryType.ROTATION,
    EditorHistoryType.OBJ_UPDATED
  ];
  return (
    supportedTypes.includes(historyData.options.type) &&
    currentItem.options.type == historyData.options.type &&
    currentItem.options.itemId == historyData.options.itemId &&
    !isTooOld(currentItem)
  );
};

export default HistoryData;
