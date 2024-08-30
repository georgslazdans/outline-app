"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useCallback } from "react";
import { downloadFile } from "@/lib/utils/Download";
import newWorkerInstance from "../../ReplicadWorker";
import { useModelDataContext } from "../../ModelDataContext";
import { Tooltip } from "react-tooltip";
import { useModelLoadingIndicatorContext } from "../../cache/ModelLoadingIndicatorContext";

type Props = {
  dictionary: Dictionary;
};

const ResultToolbar = ({ dictionary }: Props) => {
  const { modelData } = useModelDataContext();
  const { setIsLoading } = useModelLoadingIndicatorContext();

  const onDownload = useCallback(() => {
    const { api, worker } = newWorkerInstance();
    setIsLoading(true);
    api.downloadBlob(modelData).then(
      (blob) => {
        downloadFile(blob as Blob, "export.stl");
        setIsLoading(false);
        worker.terminate();
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
  }, [modelData, setIsLoading]);

  return (
    <>
      <Button id="download-stl-model" onClick={() => onDownload()}>
        <label>Download</label>
        <Tooltip anchorSelect={"#download-stl-model"} place="top">
          Download STL Model
        </Tooltip>
      </Button>
    </>
  );
};

export default ResultToolbar;
