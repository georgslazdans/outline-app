import * as cv from "@techstark/opencv-js";

const handleOpenCvError = (error: any) => {
  let errorMessage = error;
  if (typeof error == "number") {
    if (!isNaN(error)) {
      errorMessage = "Exception: " + cv.exceptionFromPtr(error).msg;
    }
  }
  console.error(errorMessage, error);
  return errorMessage;
};

export default handleOpenCvError;
