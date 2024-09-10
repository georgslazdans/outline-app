"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useIndexedDB } from "react-indexed-db-hook";
import useNavigationHistory from "@/context/NavigationHistory";
import Model from "@/lib/Model";
import { useModelContext } from "../../context/ModelContext";
import EntryField from "../contours/EntryField";
import BlobImage from "../image/BlobImage";

type Props = {
  dictionary: Dictionary;
  model: Model;
  onDelete: () => void;
};

const Entry = ({ dictionary, model, onDelete }: Props) => {
  const { setModel } = useModelContext();
  const router = useRouter();
  const { addHistory } = useNavigationHistory();
  const { deleteRecord } = useIndexedDB("models");

  const openModelEditor = () => {
    setModel(model);

    addHistory("/models");
    router.push("/editor");
  };

  const deleteEntry = () => {
    deleteRecord(model.id!).then(() => onDelete());
  };

  const dateString = model.addDate?.toLocaleDateString();
  const buttonClass = "h-16 p-0";
  return (
    <div className="flex flex-col border border-black dark:border-white rounded-[16px] p-3 w-full h-full">
      <div className="flex flex-row grow">
        {model.imageFile && (
          <div className="w-[16rem]">
            <BlobImage image={model.imageFile}></BlobImage>
          </div>
        )}
        <div className="ml-4 w-full">
          <h2>{model.name}</h2>
          <EntryField label={dictionary.models.date} value={dateString} />
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <Button
          onClick={openModelEditor}
          className={buttonClass}
          style="secondary"
        >
          <label>{dictionary.models.editor}</label>
        </Button>
        <Button onClick={deleteEntry} className={buttonClass} style="red">
          <label>{dictionary.models.delete}</label>
        </Button>
      </div>
    </div>
  );
};

export default Entry;
