"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReplicadWorker } from "../ReplicadWorker";
import { ModelData, modelWorkOf, ReplicadWork } from "@/lib/replicad/Work";
import { ReplicadResult } from "@/lib/replicad/Worker";

type Props = {
  modelData: ModelData;
  onWorkerMessage: (message: ReplicadResult) => void;
};

const ModelCache = ({ modelData, onWorkerMessage }: Props) => {
  const cacheRef = useRef(new Map());
  const [replicadMessages, setReplicadMessages] = useState<ReplicadWork[]>();

  const onWorkerResult = useCallback(
    (result: ReplicadResult) => {
      const item = modelData.items.find((it) => it.id === result.id);
      if (item) {
        const { translation, rotation, ...rest } = item;
        const cacheKey = JSON.stringify(rest);
        cacheRef.current.set(cacheKey, result);
      }

      onWorkerMessage(result);
    },
    [modelData, onWorkerMessage]
  );

  useEffect(() => {
    const messagesToSend: ReplicadWork[] = [];
    modelData.items.forEach((item) => {
      const { translation, rotation, ...rest } = item;
      const cacheKey = JSON.stringify(rest);

      if (!cacheRef.current.has(cacheKey)) {
        const work = modelWorkOf(item);
        messagesToSend.push(work);
      }
    });

    setReplicadMessages(messagesToSend);
  }, [modelData]);

  return (
    <ReplicadWorker
      messages={replicadMessages}
      onWorkerMessage={onWorkerResult}
    ></ReplicadWorker>
  );
};

export default ModelCache;
