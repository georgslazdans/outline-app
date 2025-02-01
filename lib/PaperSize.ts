import Options from "./utils/Options";

enum PaperSize {
  A4 = "a4",
  A3 = "a3",
  US_LETTER = "us-letter",
  US_LEGAL = "us-legal",
}

export const PaperDimensions = {
  [PaperSize.A4]: {
    width: 210,
    height: 297,
  },
  [PaperSize.A3]: {
    width: 297,
    height: 420,
  },
  [PaperSize.US_LETTER]: {
    width: 215.9,
    height: 279.4,
  },
  [PaperSize.US_LEGAL]: {
    width: 215.9,
    height: 355.6,
  },
};

export const paperSizeOfDimensions = (width: number, height: number) => {
  const size = Object.entries(PaperDimensions).find(
    (it) => it[1].width == width && it[1].height == height
  );
  return size ? size[0] : "custom";
};

const dictionaryPath = "paperSize";

export const paperSizeOptionsFor = (dictionary: any) => {
  const options = Options.of(PaperSize).withTranslation(
    dictionary,
    dictionaryPath
  );
  options.push({
    value: "custom",
    label: "Custom",
  });
  return options;
};

export default PaperSize;
