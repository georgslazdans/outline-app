"use client";

import React, { useRef } from "react";
import ImageUpload from "./ImageUpload";
import PhotoUpload from "./PhotoCapture";
import { useDetails } from "@/context/DetailsContext";
import { useRouter } from "next/navigation";
import getImageData from "@/lib/utils/ImageData";
import { useLoading } from "@/context/LoadingContext";
import useNavigationHistory from "@/context/NavigationHistory";

type Props = {
  dictionary: any;
};

const Upload = ({ dictionary }: Props) => {
  const { addHistory } = useNavigationHistory();
  const { setLoading } = useLoading();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { setDetailsContext } = useDetails();
  const router = useRouter();
  router.prefetch("/details");

  const onFileUpload = async (event: any) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const imageData = await getImageData(file, canvasRef.current);

      setDetailsContext((context) => {
        return { ...context, imageFile: file, imageData };
      });

      addHistory("/");
      router.push("/details");
    }
  };

  return (
    <div className="w-full flex flex-col xl:flex-row">
      <PhotoUpload
        className="mt-4 xl:hidden max-w-[50vh]"
        id="camera"
        onChange={onFileUpload}
      >
        {dictionary.capturePhoto}
      </PhotoUpload>
      <ImageUpload
        className="mt-4 max-w-[50vh] mx-auto"
        id="upload"
        onChange={onFileUpload}
      >
        {dictionary.uploadPicture}
      </ImageUpload>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Upload;
