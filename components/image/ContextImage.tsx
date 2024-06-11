"use client";

import { Dictionary } from "@/app/dictionaries";
import { useDetails } from "@/context/DetailsContext";

type Props = {
  dictionary: Dictionary;
};

const ContextImage = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();

  if (!detailsContext || !detailsContext.imageFile) {
    console.error("No image file loaded!");
    return null;
  }

  const imageUrl = URL.createObjectURL(detailsContext.imageFile);

  return (
    <div className="flex flex-col">
      <label className="ml-4 mb-0.5">{dictionary.details.addedImage}</label>
      <div className="flex items-center">
        {imageUrl && (
          <img
            className="mx-auto max-h-[20vh]"
            src={imageUrl}
            alt="Newly added image"
          />
        )}
      </div>
    </div>
  );
};

export default ContextImage;
