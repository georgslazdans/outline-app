"use client";

import { useCallback, useEffect, useRef } from "react";

import StepResult from "@/lib/opencv/StepResult";
import { OpenCvWork, OpenCvResult } from "@/lib/opencv/OpenCvWork";

type Props = {
  message?: OpenCvWork;
  onWorkerMessage: (
    stepResult: StepResult[],
    outlineCheckImage: ImageData
  ) => void;
  onStepError: (stepResult: StepResult[], message: string) => void;
  onError: (message: string) => void;
};

const hasImageData = (message?: OpenCvWork) => {
  const isImageEmpty = (image: ImageData) =>
    image.height === 1 && image.width === 1;
  return message?.data?.imageData && !isImageEmpty(message.data.imageData);
};

export const OpenCvWorker = ({
  message,
  onWorkerMessage,
  onStepError,
  onError,
}: Props) => {
  const workerRef = useRef<Worker>();

  const handleMessage = useCallback(
    (event: MessageEvent<OpenCvResult>) => {
      const result = event.data;

      if (result.status == "success") {
        onWorkerMessage(result.result.results!, result.outlineCheckImage);
      } else {
        if (result.result.results) {
          onStepError(result.result.results, result.result.error!);
        } else {
          onError(result.result.error!);
        }
      }
    },
    [onWorkerMessage, onError]
  );

  const addMessageHandler = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = handleMessage;
    }
  }, [handleMessage]);

  const postWork = useCallback(() => {
    if (workerRef.current && hasImageData(message)) {
      workerRef.current?.postMessage(message);
    }
  }, [message]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/opencv/Worker.ts", import.meta.url)
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
