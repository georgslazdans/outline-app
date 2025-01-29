import { adjustSvgForViewing } from "./AdjustViewbox";
import { downloadAsSvg } from "./DownloadSvg";
import fromContours from "./SvgExport";
import toPointsFunction from "./SvgImport";

namespace Svg {
  export const from = fromContours;
  export const toPoints = toPointsFunction;
  export const download = downloadAsSvg;
  export const cropForViewing = adjustSvgForViewing
}

export default Svg;
