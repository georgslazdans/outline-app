"use client";

import { useEffect, useRef } from "react";

import { OpenCvResult, OpenCvWork } from "@/lib/opencv/Worker";
import StepResult from "@/lib/opencv/StepResult";

type Props = {
  message: OpenCvWork | undefined;
  onWorkerMessage: (stepResult: StepResult[]) => void;
};

export const OpenCvWorker = ({ message, onWorkerMessage }: Props) => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/opencv/Worker.ts", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OpenCvResult>) => {
      const result = event.data;

      if (result.status == "success") {
        onWorkerMessage(result.stepResults);
      } else {
        // TODO show error, and give option to try again?
      }
    };
    if (workerRef.current) {
      workerRef.current.onmessage = handleMessage;
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.onmessage = null;
      }
    };
  }, [onWorkerMessage, workerRef]);

  useEffect(() => {
    if (workerRef.current && message) {
      console.log("Posting OpenCv Work", message);
      workerRef.current?.postMessage(message);
    }
  }, [message]);

  return <></>;
};
