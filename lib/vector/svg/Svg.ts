import { adjustSvgForViewing } from "./AdjustForViewing";
import { downloadAsSvg } from "./DownloadSvg";
import { extractOrientationOf } from "./OrientationOfSvg";
import { pathBoundsFromSVG } from "./PathBounds";
import fromContours from "./SvgExport";
import toPointsFunction from "./SvgImport";

namespace Svg {
  export const from = fromContours;
  export const toPoints = toPointsFunction;
  export const download = downloadAsSvg;
  export const cropForViewing = adjustSvgForViewing;
  export const orientationOf = extractOrientationOf;
  export const pathBoundsOf = pathBoundsFromSVG;
}

export default Svg;
