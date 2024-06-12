import Options from "./utils/Options";

enum Orientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

const dictionaryPath = "orientation";

export const orientationOptionsFor = (dictionary: any) => Options.of(Orientation).withTranslation(dictionary, dictionaryPath);

export default Orientation;
