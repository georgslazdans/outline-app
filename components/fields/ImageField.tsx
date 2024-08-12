"use client";

import { Dictionary } from "@/app/dictionaries";
import BlobImage from "../image/BlobImage";
import { useState } from "react";

type Props = {
  blob: Blob;
  dictionary: Dictionary;
};

const ImageField = ({ blob, dictionary }: Props) => {
  const placeholderDiv = <div className="mx-auto h-[15vh]" />;
  const [image, setImage] = useState(placeholderDiv);
  if (blob && image == placeholderDiv) {
    console.log("Setting image field!!!")
    setImage(<BlobImage image={blob} className="mx-auto h-[15vh]"></BlobImage>);
  }

  return (
    <div className="flex flex-col">
      <label className="ml-4 mb-0.5">{dictionary.details.addedImage}</label>
      <div className="flex items-center">{image}</div>
    </div>
  );
};

export default ImageField;
