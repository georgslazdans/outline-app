import { processImage } from "./ImageProcessor";
import * as cv from "@techstark/opencv-js";


// TODO add runtime status
addEventListener("message", async (event) => {
  cv.onRuntimeInitialized = async () => {
    const { imageData, settings } = event.data;
    postMessage(await processImage(imageData, settings));
  };
});
