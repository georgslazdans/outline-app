const getImageData = async (blob: Blob, canvas: HTMLCanvasElement | null) => {
  const ctx = canvas?.getContext("2d", { willReadFrequently: true });

  if (!canvas || !ctx) {
    throw new Error("Canvas element or context has not been initialized!");
  }
  const imageBitmap = await createImageBitmap(blob);

  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  imageBitmap.close();
  return imageData;
};

export const imageDataToBlob = (imageData: ImageData): Promise<Blob | null> => {
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx!.putImageData(imageData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
};

export default getImageData;
