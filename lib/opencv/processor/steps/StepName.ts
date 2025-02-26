enum StepName {
    INPUT = "input",
    BILATERAL_FILTER = "bilateralFilter",
    BLUR = "blur",
    BLUR_OBJECT = "blurObject",
    CANNY_PAPER = "cannyPaper",
    CANNY_OBJECT = "cannyObject",
    FIND_OBJECT_OUTLINES = "findObjectOutlines",
    FILTER_OBJECTS = "filterObjects",
    FIND_PAPER_OUTLINE = "findPaperOutline",
    EXTRACT_PAPER = "extractPaper",
    GRAY_SCALE = "grayScale",
    GRAY_SCALE_OBJECT = "grayScaleObject",
    ADAPTIVE_THRESHOLD = "adaptiveThreshold",
    THRESHOLD = "threshold",
    OBJECT_THRESHOLD = "objectThreshold",
    BINARY_THRESHOLD = "binaryThreshold",
    CLOSE_CORNERS = "closeCorners",
    CLOSE_CORNERS_PAPER = "closeCornersPaper",
}

export default StepName;