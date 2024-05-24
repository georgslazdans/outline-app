import Options from "./Options";

enum PaperSize {
  A4 = "a4",
  A3 = "a3",
  US_LETTER = "us-letter",
  US_LEGAL = "us-legal"
}

const dictionaryPath = "paperSize";

export const paperSizeOptionsFor = (dictionary: any) => Options.of(PaperSize).with(dictionary, dictionaryPath);

export default PaperSize;
