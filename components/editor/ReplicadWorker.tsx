"use client";

import { ReplicadWork } from "@/lib/replicad/Work";
import { ReplicadResult } from "@/lib/replicad/Worker";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  messages?: ReplicadWork[];
  onWorkerMessage: (result: ReplicadResult) => void;
  onError?: (message: string) => void;
};

export const ReplicadWorker = ({
  messages,
  onWorkerMessage,
  onError,
}: Props) => {
  const workerRef = useRef<Worker>();

  const handleMessage = useCallback(
    (event: MessageEvent<ReplicadResult>) => {
      const result = event.data as ReplicadResult;
      onWorkerMessage(result);
    },
    [onWorkerMessage]
  );

  const addMessageHandler = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = handleMessage;
    }
  }, [handleMessage]);

  useEffect(() => {
    addMessageHandler();
  }, [addMessageHandler]);

  const postWork = useCallback(() => {
    if (workerRef.current && messages && messages.length > 0) {
      messages.forEach((message) => {
        console.log("Posting message", message);
        workerRef.current?.postMessage(message);
      });
    }
  }, [messages]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/replicad/Worker.ts", import.meta.url)
    );
    addMessageHandler();
    postWork();
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    postWork();
  }, [postWork]);

  return <></>;
};
