import * as Comlink from 'comlink';
import Settings from './Settings';
import { OutlineResult, processImage } from './ImageProcessor';

const OpenCVWorker = {
  outlineOf: async (imageData: ImageData, settings: Settings): Promise<OutlineResult> => {
    return await processImage(imageData, settings);
  }
};

Comlink.expose(OpenCVWorker);