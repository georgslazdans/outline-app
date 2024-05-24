import Options from "./Options";

enum Orientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

const dictionaryPath = "orientation";

export const orientationOptionsFor = (dictionary: any) => Options.of(Orientation).with(dictionary, dictionaryPath);

export default Orientation;
