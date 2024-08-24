"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useCallback } from "react";
import { downloadFile } from "@/lib/utils/Download";
import newWorkerInstance from "../../replicad/ReplicadWorker";
import { useModelDataContext } from "../../ModelDataContext";

type Props = {
  dictionary: Dictionary;
};

const ResultToolbar = ({ dictionary }: Props) => {
  const { modelData } = useModelDataContext();

  const onDownload = useCallback(() => {
    const { api, worker } = newWorkerInstance();
    api.downloadBlob(modelData).then((blob) => {
      downloadFile(blob as Blob, "export.stl");
      worker.terminate();
    });
  }, []);

  return (
    <>
      <Button onClick={() => onDownload()}>
        <label>Download</label>
      </Button>
    </>
  );
};

export default ResultToolbar;
