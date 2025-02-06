"use client";

import React from "react";
import ImageUpload from "./ImageUpload";
import PhotoUpload from "./PhotoCapture";
import { Context, useDetails } from "@/context/DetailsContext";
import { useRouter } from "next/navigation";
import getImageData, { scaleImage } from "@/lib/utils/ImageData";
import { useLoading } from "@/context/LoadingContext";
import useNavigationHistory from "@/context/NavigationHistory";
import { useIndexedDB } from "react-indexed-db-hook";

type Props = {
  dictionary: any;
};

const Upload = ({ dictionary }: Props) => {
  const { add: addFile } = useIndexedDB("files");
  const { addHistory } = useNavigationHistory();
  const { setLoading } = useLoading();
  const { setDetailsContext, setContextImageData } = useDetails();
  const router = useRouter();
  router.prefetch("/details");

  const onFileUpload = async (event: any) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const imageData = getImageData(file);
      const fileId = await addFile({ blob: file });
      const thumbnailId = await addFile({ blob: await scaleImage(file) });
      setContextImageData(await imageData);
      setDetailsContext((context: Context) => {
        return {
          details: context?.details,
          addDate: new Date(),
          contours: [],
          settings: context?.settings,
          imageFile: fileId,
          thumbnail: thumbnailId
        };
      });

      addHistory("/");
      router.push("/details");
    }
  };

  return (
    <div className="w-full flex flex-col xl:flex-row">
      <PhotoUpload
        className="mt-4 xl:hidden max-w-[50vh] mx-auto"
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
    </div>
  );
};

export default Upload;
