"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import BlobImage from "./BlobImage";

type Props = {
  detailsContext: Context;
  dictionary: Dictionary;
};

const ImageField = ({detailsContext,  dictionary }: Props) => {
  let image = <div className="mx-auto h-[15vh]" />;
  if (detailsContext && detailsContext.imageFile) {
    image = (
      <BlobImage
      image={detailsContext.imageFile}
      className="mx-auto h-[15vh]">
      </BlobImage>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="ml-4 mb-0.5">{dictionary.details.addedImage}</label>
      <div className="flex items-center">{image}</div>
    </div>
  );
};

export default ImageField;
