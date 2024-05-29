"use client";

import React, { useRef } from "react";
import ImageUpload from "./ImageUpload";
import PhotoUpload from "./PhotoCapture";
import { useDetails } from "@/context/DetailsContext";
import { useRouter } from "next/navigation";

type Props = {
  dictionary: any;
};

const Upload = ({ dictionary }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { setDetailsContext } = useDetails();
  const router = useRouter();

  const onFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageData = await getImageData(file);

      console.log("Image data!", imageData)
      setDetailsContext((context) => {
        return { ...context, imageFile: file, imageData };
      });

      router.push("/details");
    }
  };

  const getImageData = async (blob: Blob) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      throw new Error("Canvas element or context has not been initialized!");
    }
    const imageBitmap = await createImageBitmap(blob);

    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    ctx.drawImage(imageBitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    imageBitmap.close();
    return imageData;
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
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default Upload;
