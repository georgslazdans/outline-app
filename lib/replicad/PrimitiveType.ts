import Options from "../utils/Options";

enum PrimitiveType {
  BOX = "box",
  CYLINDER = "cylinder",
  SPHERE = "sphere",
}

const dictionaryPath = "primitive";

export const primitiveTypeOptionsFor = (dictionary: any) =>
  Options.of(PrimitiveType).withTranslation(dictionary, dictionaryPath);

export default PrimitiveType;
