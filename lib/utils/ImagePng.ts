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