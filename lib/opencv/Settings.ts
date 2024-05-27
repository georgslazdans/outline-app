import Orientation from "../Orientation"
import PaperSize from "../PaperSize"

type Settings = {
    blurWidth:number,
    threshold1: number,
    threshold2: number,
    paper: PaperSettings
}

type PaperSettings = {
    size: PaperSize,
    orientation: Orientation
}

export default Settings