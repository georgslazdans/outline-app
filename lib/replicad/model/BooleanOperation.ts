import Options from "../../utils/Options";

enum BooleanOperation {
  UNION = "union",
  CUT = "cut",
  INTERSECTION = "intersection",
}

export const nameOfBooleanOperation = (operation: BooleanOperation): string => {
  const itemType = operation.valueOf();
  return itemType.charAt(0).toUpperCase() + itemType.slice(1);
};

const dictionaryPath = "booleanOperation";

export const booleanOperationOptionsFor = (dictionary: any) =>
  Options.of(BooleanOperation).withTranslation(dictionary, dictionaryPath);

export default BooleanOperation;
