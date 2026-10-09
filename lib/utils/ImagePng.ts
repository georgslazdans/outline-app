const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Width and height from the PNG IHDR chunk. Throws if the buffer is not a PNG. */
export const pngSizeOf = (pngBuffer: ArrayBuffer): { width: number; height: number } => {
  if (!pngBuffer || pngBuffer.byteLength < 24) {
    throw new Error("pngSizeOf: buffer is too short to be a PNG");
  }
  const view = new DataView(pngBuffer);
  for (let i = 0; i < PNG_SIGNATURE.length; i++) {
    if (view.getUint8(i) !== PNG_SIGNATURE[i]) {
      throw new Error("pngSizeOf: buffer is not a PNG (bad signature)");
    }
  }
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  if (width === 0 || height === 0) {
    throw new Error("pngSizeOf: PNG has zero dimensions");
  }
  return { width, height };
};

export const decodePngToImageData = async (pngBuffer: ArrayBuffer): Promise<ImageData> => {
  const blob = new Blob([pngBuffer], { type: "image/png" });
  const bitmap = await createImageBitmap(blob);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);

  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
};

export const encodeImageDataToPngBuffer = async (imageData: ImageData): Promise<ArrayBuffer> => {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(imageData, 0, 0);

  const blob = await canvas.convertToBlob({ type: "image/png" });
  return await blob.arrayBuffer();
};