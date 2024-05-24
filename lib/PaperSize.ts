import Options from "./Options";

enum PaperSize {
  A4 = "a4",
  A3 = "a3",
  US_LETTER = "us-letter",
  US_LEGAL = "us-legal"
}

export const PaperDimensions = {
    [PaperSize.A4]: {
        width: 210,
        height: 297
    },
    [PaperSize.A3]: {
        width: 297,
        height: 420
    },
    [PaperSize.US_LETTER]: {
        width: 215.9,
        height: 279.4
    },
    [PaperSize.US_LEGAL]: {
        width: 216,
        height: 356
    }
};

const dictionaryPath = "paperSize";

export const paperSizeOptionsFor = (dictionary: any) => Options.of(PaperSize).with(dictionary, dictionaryPath);

export default PaperSize;
