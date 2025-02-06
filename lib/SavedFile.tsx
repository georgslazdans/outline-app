import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

type SavedFile = {
  id: number;
  blob: Blob;
};

export const useSavedFile = (id?: number) => {
  const { getByID } = useIndexedDB("files");

  const [imageBlob, setImageBlob] = useState<Blob>();

  useEffect(() => {
    if (id) {
      getByID(id).then((it: SavedFile) => {
        setImageBlob(it.blob);
      });
    }
  });

  return imageBlob;
};

export default SavedFile;
