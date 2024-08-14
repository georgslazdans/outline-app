"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useState } from "react";
import { downloadWorkOf, ModelData, ReplicadWork } from "@/lib/replicad/Work";
import { ReplicadWorker } from "../ReplicadWorker";
import { ReplicadResult } from "@/lib/replicad/Worker";
import { downloadFile } from "@/lib/utils/Download";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
};

const ResultToolbar = ({ dictionary, modelData }: Props) => {
  const [replicadMessage, setReplicadMessage] = useState<ReplicadWork>();

  const onWorkerMessage = (blob: ReplicadResult) => {
    downloadFile(blob as Blob, "export.stl");
    setReplicadMessage(undefined);
  };

  const onDownload = () => {
    setReplicadMessage(downloadWorkOf(modelData.items));
  };

  const asMessageArray = () => {
    return replicadMessage ? [replicadMessage] : [];
  };

  return (
    <>
      <ReplicadWorker
        messages={asMessageArray()}
        onWorkerMessage={onWorkerMessage}
      ></ReplicadWorker>
      <Button onClick={() => onDownload()}>
        <label>Download</label>
      </Button>
    </>
  );
};

export default ResultToolbar;
