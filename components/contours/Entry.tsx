"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context, useDetails } from "@/context/DetailsContext";
import React from "react";
import BlobImage from "../image/BlobImage";
import EntryField from "./EntryField";
import Button from "../Button";
import { useRouter } from "next/navigation";
import Svg from "@/lib/svg/Svg";
import { downloadFile } from "@/lib/utils/Download";
import { useIndexedDB } from "react-indexed-db-hook";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import { centerPoints } from "@/lib/Point";
import useNavigationHistory from "@/context/NavigationHistory";

type Props = {
  context: Context;
  dictionary: Dictionary;
  onDelete: () => void;
};

const Entry = ({ context, dictionary, onDelete }: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();
  const router = useRouter();
  const { addHistory } = useNavigationHistory();
  const { deleteRecord } = useIndexedDB("details");

  const openSettings = () => {
    setDetailsContext(context);

    addHistory("/contours");
    router.push("/calibration");
  };

  const hasSvg = !!context.contours;

  const exportSvg = () => {
    if (hasSvg) {
      const paperDimensions = paperDimensionsOfDetailsContext(context);
      const contours = context.contours!.map((it) =>
        centerPoints(it, paperDimensions)
      );
      const svg = Svg.from(contours, paperDimensions);
      const blob = new Blob([svg], {
        type: "image/svg+xml",
      });
      downloadFile(blob, `outline-${new Date().toLocaleDateString("lv")}.svg`);
    }
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
          <BlobImage image={context.imageFile}></BlobImage>
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
          <label>{dictionary.contours.settings}</label>
        </Button>
        <Button
          onClick={exportSvg}
          className={buttonClass}
          style={hasSvg ? "secondary" : "disabled"}
        >
          <label>{dictionary.contours.svg}</label>
        </Button>
        <Button onClick={deleteEntry} className={buttonClass} style="red">
          <label>{dictionary.contours.delete}</label>
        </Button>
      </div>
    </div>
  );
};

export default Entry;
