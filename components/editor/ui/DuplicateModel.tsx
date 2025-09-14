"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { RefObject } from "react";
import Button from "../../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { useModelContext } from "../ModelContext";
import { useLoading } from "@/context/LoadingContext";
import { Tooltip } from "react-tooltip";
import Model from "@/lib/Model";
import { useErrorModal } from "@/components/error/ErrorContext";
import { scaleImage } from "@/lib/utils/ImageData";
import { addCopyName } from "@/lib/utils/EntryDuplicateName";
import { useRouter } from "next/navigation";
import { idQuery } from "@/lib/utils/UrlParams";
import IconButton from "@/components/IconButton";

type Props = {
  dictionary: Dictionary;
  canvasRef: RefObject<HTMLCanvasElement>;
};

const DuplicateModel = ({ dictionary, canvasRef }: Props) => {
  const { add } = useIndexedDB("models");
  const { add: addImageBlob } = useIndexedDB("files");
  const router = useRouter();

  const { model, setModel } = useModelContext();
  const { setLoading } = useLoading();
  const { showError } = useErrorModal();

  const saveModel = (newModel: Model) => {
    add(newModel).then(
      (dbId) => {
        setModel({ ...newModel, id: dbId });
        router.replace("/editor" + "?" + idQuery(dbId.toString()));

        console.log("Duplicate model saved!", newModel.id);
      },
      (error) => {
        showError(error);
      }
    );
  };

  const onDuplicateModel = async () => {
    setLoading(true);

    canvasRef.current!.toBlob(async (blob) => {
      if (blob) {
        const scaledBlob = await scaleImage(blob);
        const imageFileId = await addImageBlob({ blob: scaledBlob });
        const duplicateModel = {
          ...model,
          name: addCopyName(model.name),
          imageFile: imageFileId,
        };
        delete duplicateModel.id;
        saveModel(duplicateModel);

        setLoading(false);
      } else {
        saveModel(model);
        setLoading(false);
      }
    }, "image/png");
  };

  const duplicateIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
      />
    </svg>
  );

  const id = "duplicate-model-button";
  return (
    <>
      <IconButton
        id={id}
        className="px-2 py-2 mr-auto mt-1 ml-1"
        onClick={onDuplicateModel}
      >
        {duplicateIcon}
        <Tooltip anchorSelect={"#" + id} place="top">
          Duplicate and create a copy of the model
        </Tooltip>
      </IconButton>
    </>
  );
};

export default DuplicateModel;
