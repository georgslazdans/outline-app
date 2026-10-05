const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Reads the width and height from a PNG's IHDR chunk without decoding the image.
 * The IHDR is always the first chunk: after the 8-byte signature comes a 4-byte
 * length and the 4-byte "IHDR" type, then a big-endian 32-bit width (bytes
 * 16-19) and height (bytes 20-23). Returns `undefined` for anything that is not
 * a valid PNG or has a zero dimension.
 */
export const pngSizeOf = (
  pngBuffer: ArrayBuffer
): { width: number; height: number } | undefined => {
  if (!pngBuffer || pngBuffer.byteLength < 24) {
    return undefined;
  }
  const view = new DataView(pngBuffer);
  for (let i = 0; i < PNG_SIGNATURE.length; i++) {
    if (view.getUint8(i) !== PNG_SIGNATURE[i]) {
      return undefined;
    }
  }
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  if (width === 0 || height === 0) {
    return undefined;
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