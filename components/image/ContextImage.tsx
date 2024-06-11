"use client";

import { Dictionary } from "@/app/dictionaries";
import { useDetails } from "@/context/DetailsContext";

type Props = {
  dictionary: Dictionary;
};

const ContextImage = ({ dictionary }: Props) => {
  const { detailsContext } = useDetails();

  let image = <div className="mx-auto h-[15vh]" />;
  if (detailsContext && detailsContext.imageFile) {
    const imageUrl = URL.createObjectURL(detailsContext.imageFile);
    image = (
      <img
        className="mx-auto h-[15vh]"
        src={imageUrl}
        alt="Newly added image"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <label className="ml-4 mb-0.5">{dictionary.details.addedImage}</label>
      <div className="flex items-center">{image}</div>
    </div>
  );
};

export default ContextImage;
