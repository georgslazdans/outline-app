"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import React from "react";
import EntryField from "./EntryField";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useIndexedDB } from "react-indexed-db-hook";
import useNavigationHistory from "@/context/NavigationHistory";
import { idQuery } from "@/lib/utils/UrlParams";
import ExportDropdown from "./ExportDropdown";
import LazyLoadImage from "../image/lazy/LazyLoadedImage";

type Props = {
  context: Context;
  dictionary: Dictionary;
  onDelete: () => void;
};

const Entry = ({ context, dictionary, onDelete }: Props) => {
  const router = useRouter();
  const { addHistory } = useNavigationHistory();
  const { deleteRecord } = useIndexedDB("details");

  const openSettings = async () => {
    addHistory("/contours");
    router.push("/calibration" + "?" + idQuery(context.id!.toString()));
  };

  const deleteEntry = () => {
    deleteRecord(context.id!).then(() => onDelete());
  };

  const dateString = context.addDate?.toLocaleDateString();
  const buttonClass = "h-16 p-0";
  return (
    <div className="flex flex-col border border-black dark:border-white rounded-[16px] p-3 w-full h-full">
      <div className="flex flex-row grow">
        <div className="w-[16rem]">
          <LazyLoadImage imageId={context.thumbnail}></LazyLoadImage>
        </div>
        <div className="ml-4 w-full">
          <h2>{context.details?.name}</h2>
          <EntryField label={dictionary.contours.date} value={dateString} />
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <Button
          onClick={openSettings}
          className={buttonClass}
          style="secondary"
        >
          <label className="cursor-pointer">{dictionary.contours.open}</label>
        </Button>
        <ExportDropdown
          context={context}
          dictionary={dictionary}
        ></ExportDropdown>
        <Button onClick={deleteEntry} className={buttonClass} style="red">
          <label className="cursor-pointer">{dictionary.contours.delete}</label>
        </Button>
      </div>
    </div>
  );
};

export default Entry;
