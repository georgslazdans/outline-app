"use client";

import { Dictionary } from "@/app/dictionaries";
import BlobImage from "../image/BlobImage";
import { useMemo } from "react";

type Props = {
  blob?: Blob;
  dictionary: Dictionary;
};

const ImageField = ({ blob, dictionary }: Props) => {
  const imageDiv = useMemo(() => {
    return blob ? (
      <BlobImage image={blob} className="mx-auto h-[15vh]"></BlobImage>
    ) : (
      <div className="mx-auto h-[15vh]" />
    );
  }, [blob]);

  return (
    <div className="flex flex-col">
      <label className="ml-4 mb-0.5">{dictionary.details.addedImage}</label>
      <div className="flex items-center">{imageDiv}</div>
    </div>
  );
};

export default ImageField;
