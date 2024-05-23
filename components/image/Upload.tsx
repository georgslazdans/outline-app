"use client";

import React from "react";
import ImageUpload from "./ImageUpload";
import PhotoUpload from "./PhotoCapture";
import { useImage } from "@/context/ImageContext";
import { useRouter } from "next/navigation";

type Props = {
  dictionary: any;
};

const Upload = ({ dictionary }: Props) => {
  const { setImageFile } = useImage();
  const router = useRouter();

  const onFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      router.push("/details");
    }
  };

  return (
    <>
      <PhotoUpload
        className="mt-4 xl:hidden"
        id="camera"
        onChange={onFileUpload}
      >
        {dictionary.capturePhoto}
      </PhotoUpload>
      <ImageUpload className="mt-4" id="upload" onChange={onFileUpload}>
        {dictionary.uploadPicture}
      </ImageUpload>
    </>
  );
};

export default Upload;
