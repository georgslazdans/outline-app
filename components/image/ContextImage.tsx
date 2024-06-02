"use client";

import { useDetails } from "@/context/DetailsContext";

const ContextImage = () => {
  const { detailsContext } = useDetails();

  if (!detailsContext || !detailsContext.imageFile) {
    console.error("No image file loaded!");
    return null;
  }

  const imageUrl = URL.createObjectURL(detailsContext.imageFile);

  return (
    <div className="flex items-center">
      {imageUrl && <img className="mx-auto max-h-[20vh]" src={imageUrl} alt="Newly added image" />}
    </div>
  );
};

export default ContextImage;
