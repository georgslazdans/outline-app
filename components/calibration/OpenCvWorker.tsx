"use client";

import { useCallback, useEffect, useRef } from "react";

import { OpenCvResult, OpenCvWork } from "@/lib/opencv/Worker";
import StepResult from "@/lib/opencv/StepResult";

type Props = {
  message?: OpenCvWork;
  onWorkerMessage: (stepResult: StepResult[]) => void;
};

const hasImageData = (message?: OpenCvWork) => {
  const isImageEmpty = (image: ImageData) =>
    image.height === 1 && image.width === 1;
  return message?.data?.imageData && !isImageEmpty(message.data.imageData);
};

export const OpenCvWorker = ({ message, onWorkerMessage }: Props) => {
  const workerRef = useRef<Worker>();

  const handleMessage = useCallback(
    (event: MessageEvent<OpenCvResult>) => {
      const result = event.data;

      if (result.status == "success") {
        onWorkerMessage(result.stepResults);
      } else {
        // TODO show error, and give option to try again?
      }
    },
    [onWorkerMessage]
  );

  const addMessageHandler = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = handleMessage;
    }
  }, [handleMessage]);

  const postWork = useCallback(() => {
    if (workerRef.current && hasImageData(message)) {
      console.log("Posting OpenCv Work", message);
      workerRef.current?.postMessage(message);
    }
  }, [message]);

  useEffect(() => {
    console.log("Creating new wokrer");
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
