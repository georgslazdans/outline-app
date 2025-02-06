const getImageData = async (
  blob: Blob,
  canvas: HTMLCanvasElement = document.createElement("canvas")
) => {
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

export const isImageDataEmpty = (image: ImageData) =>
  image.height === 1 && image.width === 1;

export const scaleImage = (
  file: Blob,
  maxWidth = 400,
  maxHeight = 400
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas not supported");
        return;
      }
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else reject("Failed to create thumbnail");
        },
        "image/jpeg",
        1
      );
    };

    img.onerror = (err) => reject(err);
  });
};

export default getImageData;
