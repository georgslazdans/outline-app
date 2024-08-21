"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useCallback } from "react";
import { ModelData } from "@/lib/replicad/ModelData";
import { downloadFile } from "@/lib/utils/Download";
import newWorkerInstance from "../../replicad/ReplicadWorker";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
};

const ResultToolbar = ({ dictionary, modelData }: Props) => {

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
