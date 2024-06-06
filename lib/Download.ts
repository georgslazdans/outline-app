export function downloadFile(blob: Blob, fileName: string) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
  }

  const ImageDataToBlob = (imageData: ImageData) => {
    let w = imageData.width;
    let h = imageData.height;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx!.putImageData(imageData, 0, 0);
  
    return new Promise((resolve) => {
          canvas.toBlob(resolve); // implied image/png format
    });
  }