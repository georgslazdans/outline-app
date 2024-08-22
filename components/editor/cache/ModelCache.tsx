"use client";

import React, { useEffect, useState } from "react";
import ModelData from "@/lib/replicad/ModelData";
import { useModelCache } from "./ModelCacheContext";
import { Gridfinity, Item, Primitive, Shadow } from "@/lib/replicad/Model";
import {
  newWorkerInstance
} from "../replicad/ReplicadWorker";
import { ItemModel } from "../mode/edit/EditCanvas";
import ReplicadResult from "@/lib/replicad/WorkerResult";

type Props = {
  models: ItemModel;
  modelData: ModelData;
  onModelData: (id: string, message: ReplicadResult) => void;
};

type MessageGroup = { id: string; key: string; work: Item };

const withoutItemData = (item: Item): Gridfinity | Primitive | Shadow => {
  const { id, translation, rotation, booleanOperation, ...rest } = item;
  return rest;
};

const keyOf = (item: Item) => JSON.stringify(withoutItemData(item));

const ModelCache = ({ modelData, onModelData, models }: Props) => {
  const { addToCache, getFromCache } = useModelCache();
  const [messages, setMessages] = useState<MessageGroup[]>([]);
  const [workers, setWorkers] = useState<Map<string, { cancel: () => void }>>(
    new Map()
  );

  useEffect(() => {
    const newMessages: MessageGroup[] = [];
    const addItem = (key: string, item: Item) => {
      newMessages.push({ id: item.id, key: key, work: item });
    };

    modelData.items.forEach((item) => {
      const key = keyOf(item);
      const cacheEntry = getFromCache(key);

      if (!cacheEntry) {
        const currentMessage = messages.find((it) => it.id === item.id);
        if (currentMessage && currentMessage.key !== key) {
          const currentWorker = workers.get(currentMessage.key);
          if (currentWorker) {
            currentWorker.cancel();
          }
          addItem(key, item);
        }
        if (!currentMessage) {
          addItem(key, item);
        }
      } else if (!models[item.id] || models[item.id] != cacheEntry) {
        onModelData(item.id, cacheEntry);
      }
    });

    setMessages(newMessages);
  }, [models, modelData]);

  useEffect(() => {
    messages.forEach((item) => {
      const cacheEntry = getFromCache(item.key);

      if (cacheEntry) {
        onModelData(item.id, cacheEntry);
      } else if (!workers.has(item.key)) {
        const { api, worker } = newWorkerInstance();

        const promise = api.processItem(item.work).then((result) => {
          addToCache(item.key, result);
          onModelData(item.id, result);

          setWorkers((prevWorkers) => {
            const updatedWorkers = new Map(prevWorkers);
            updatedWorkers.delete(item.key); // Remove worker from the map after it completes
            return updatedWorkers;
          });

          worker.terminate();
        });

        const cancel = () => {
          worker.terminate();
        };

        setWorkers((prevWorkers) => {
          const updatedWorkers = new Map(prevWorkers);
          updatedWorkers.set(item.key, { cancel });
          return updatedWorkers;
        });
      }
    });
  }, [messages]);

  return <></>;
};

export default ModelCache;
