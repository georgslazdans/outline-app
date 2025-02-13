import { downloadAsDxf } from "./DownloadDxf";
import fromContours from "./DxfExport";

namespace Dxf {
  export const from = fromContours;
  export const download = downloadAsDxf;
}

export default Dxf;
