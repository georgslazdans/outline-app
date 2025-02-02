import * as cv from "@techstark/opencv-js";

const handleOpenCvError = (error: any) => {
  let errorMessage = "";
  if (typeof error == "number") {
    if (!isNaN(error)) {
      errorMessage = "Exception: " + cv.exceptionFromPtr(error).msg;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = error;
  }
  console.error(errorMessage, error);
  return errorMessage;
};

export default handleOpenCvError;
