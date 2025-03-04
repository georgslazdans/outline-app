import { downloadFile } from "../utils/Download";
import JsZip from "jszip";

const downloadModelBlobs = (blobs: Blob[], name: string, extension: string) => {
  if (blobs.length == 1) {
    downloadFile(blobs[0], `${name}.${extension}`);
  } else {
    asZipFile(blobs, name, extension).then((zip) =>
      downloadFile(zip, `${name}_${extension}.zip`)
    );
  }
};

const asZipFile = (
  blobs: Blob[],
  name: string,
  extension: string
): Promise<Blob> => {
  var zip = new JsZip();
  blobs.forEach((blob, index) =>
    zip.file(`${name}-${index}.${extension}`, blob)
  );
  return zip.generateAsync({ type: "blob" });
};

export default downloadModelBlobs;
