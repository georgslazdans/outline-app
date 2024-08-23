import Options from "../utils/Options";

enum BooleanOperation {
  UNION = "union",
  CUT = "cut",
  INTERSECTION = "intersection",
}

const dictionaryPath = "booleanOperation";

export const booleanOperationOptionsFor = (dictionary: any) =>
  Options.of(BooleanOperation).withTranslation(dictionary, dictionaryPath);

export default BooleanOperation;
