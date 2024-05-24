"use client";

import { useImage } from "@/context/ImageContext";
import { useRouter } from "next/navigation";

const LoadedImage = () => {
  const { imageFile } = useImage();
  const router = useRouter();

  if (!imageFile) {
    console.error("No image file loaded!");
    router.push("/");
    return (<></>)
  }

  const imageUrl = URL.createObjectURL(imageFile);

  return (
    <div className="flex items-center">
      {imageUrl && <img className="mx-auto max-h-[20vh]" src={imageUrl} alt="Newly added image" />}
    </div>
  );
};

export default LoadedImage;
