"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReplicadWorker } from "../ReplicadWorker";
import { ModelData, ModelPart, modelWorkOf } from "@/lib/replicad/Work";
import { ReplicadResult } from "@/lib/replicad/Worker";
import { useModelCache } from "@/context/ModelCacheContext";
import deepEqual from "@/lib/utils/Objects";
import { Item } from "@/lib/replicad/Model";

type Props = {
  modelData: ModelData;
  onWorkerMessage: (message: ReplicadResult) => void;
};

const ModelCache = ({ modelData, onWorkerMessage }: Props) => {
  const { addToCache, getFromCache } = useModelCache();
  const [previousData, setPreviousData] = useState<Item[]>([]);
  const [replicadMessages, setReplicadMessages] = useState<ModelPart[]>([]);

  useEffect(() => {
    const items = modelData.items.map((it) => {
      const { translation, rotation, ...rest } = it;
      return rest;
    });
    if (!deepEqual(previousData, items)) {
      console.log("Updating previous data", items);
      setPreviousData(items);
    }
  }, [modelData, previousData]);

  const alreadyQueued = useCallback(
    (work: ModelPart) => {
      return replicadMessages?.some((msg) => deepEqual(msg, work));
    },
    [replicadMessages]
  );

  useEffect(() => {
    const messagesToSend: ModelPart[] = [];
    previousData.forEach((item) => {
      const cacheKey = JSON.stringify(item);
      const cacheEntry = getFromCache(cacheKey);

      if (!cacheEntry) {
        const work = modelWorkOf(item);
        if (!alreadyQueued(work)) {
          console.log("WORK!", work);
          messagesToSend.push(work);
        }
      } else {
        onWorkerMessage(cacheEntry);
      }
    });
    if (messagesToSend.length > 0) {
      setReplicadMessages((messages) => [...messages, ...messagesToSend]);
    }
  }, [alreadyQueued, getFromCache, onWorkerMessage, previousData]);

  const onWorkerResult = useCallback(
    (result: ReplicadResult) => {
      const item = previousData.find((it) => it.id === result.id);
      if (item) {
        const { translation, rotation, ...rest } = item;
        const cacheKey = JSON.stringify(rest);
        addToCache(cacheKey, result);
      }

      onWorkerMessage(result);
      setReplicadMessages((messages) =>
        messages.filter((it) => it.item.id != item?.id)
      );
    },
    [previousData, onWorkerMessage, addToCache]
  );

  return (
    <ReplicadWorker
      messages={replicadMessages}
      onWorkerMessage={onWorkerResult}
    ></ReplicadWorker>
  );
};

export default ModelCache;
