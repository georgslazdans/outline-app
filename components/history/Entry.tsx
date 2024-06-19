"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import React from "react";
import BlobImage from "../image/BlobImage";
import EntryField from "./EntryField";
import Button from "../Button";

type Props = {
  context: Context;
  dictionary: Dictionary;
};

const Entry = ({ context, dictionary }: Props) => {
  const dateString = context.addDate?.toLocaleDateString();
  const buttonClass = "h-10 p-0";
  return (
    <>
      <div className="border border-black dark:border-white rounded-[16px] p-3 w-full">
        <div className="flex flex-row">
          <div className="w-[10rem]">
            <BlobImage image={context.imageFile}></BlobImage>
          </div>
          <div className="ml-4">
            <h2>{context.details?.name}</h2>
            <EntryField label={dictionary.history.date} value={dateString} />
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-2">
          <Button className={buttonClass}>
            <label>{dictionary.history.settings}</label>
          </Button>
          <Button className={buttonClass}>
            <label>{dictionary.history.svg}</label>
          </Button>
          <Button className={buttonClass}>
            <label>{dictionary.history.delete}</label>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Entry;
