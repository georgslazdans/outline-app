import Options from "../../../utils/Options";

enum ThresholdType {
  ADAPTIVE = "adaptive",
  BINARY = "binary",
}
const dictionaryPath = "threshold";

export const thresholdOptionsFor = (dictionary: any) =>
  Options.of(ThresholdType).withTranslation(dictionary, dictionaryPath);

export default ThresholdType;
