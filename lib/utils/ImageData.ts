const getImageData = async (blob: Blob, canvas: HTMLCanvasElement | null) => {
  const ctx = canvas?.getContext("2d");

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

export default getImageData;
