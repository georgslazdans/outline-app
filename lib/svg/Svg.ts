import fromContours from "./SvgExport";
import toPointsFunction from "./SvgImport";

namespace Svg {
  export const from = fromContours;
  export const toPoints = toPointsFunction;
}

export default Svg;
