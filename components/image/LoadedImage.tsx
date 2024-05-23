"use client";

import { useImage } from "@/context/ImageContext";
import { useRouter } from "next/navigation";

const LoadedImage = () => {
  const { imageFile } = useImage();
  const router = useRouter();

  if (!imageFile) {
    console.error("No image file loaded!");
    router.push("/");
  }

  const imageUrl = URL.createObjectURL(imageFile);

  return (
    <div>
      <img
        src={imageUrl}
        alt="Newly added image"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default LoadedImage;
