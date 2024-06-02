"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useDetails } from "@/context/DetailsContext";
import Settings, { defaultSettings } from "@/lib/opencv/Settings";
import { OpenCvDebugger } from "./OpenCvDebugger";
import StepResult from "@/lib/opencv/StepResult";
import { OpenCvResult, OpenCvWork } from "@/lib/opencv/Worker";
import { useLoading } from "@/context/LoadingContext";

type Props = {
  dictionary: any;
};

export const OpenCvCalibration = ({ dictionary }: Props) => {
  const router = useRouter();
  const workerRef = useRef<Worker>();

  const [stepResults, setStepResults] = useState<StepResult[]>([]);

  const { detailsContext } = useDetails();
  const { setLoading } = useLoading();

  const updateStepResults = (newResult: StepResult[]) => {
    setStepResults((previousResult) => {
      const updatedResult = [...previousResult];
      newResult.forEach((newStep) => {
        const index = updatedResult.findIndex(
          (step) => step.stepName === newStep.stepName
        );
        if (index !== -1) {
          updatedResult[index] = newStep;
        } else {
          updatedResult.push(newStep);
        }
      });
      return updatedResult;
    });
  };

  useEffect(() => {
    if (!detailsContext) {
      setLoading(false);
      router.push("/");
    }
  }, [detailsContext, router, setLoading]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/opencv/Worker.ts", import.meta.url)
    );
    workerRef.current.onmessage = (event) => {
      const result = event.data as OpenCvResult;
      setLoading(false);
      if (result.status == "success") {
        updateStepResults(result.stepResults);
      } else {
        // TODO show error, and give option to try again?
      }
    };
    return () => {
      setLoading(false);
      workerRef.current?.terminate();
    };
  }, [setLoading]);

  const outlineOf = useCallback(async () => {
    const imageData =
      detailsContext?.imageData ||
      (typeof window !== "undefined" ? new ImageData(4, 4) : null);
    const settings: Settings = defaultSettings();

    const workData: OpenCvWork = {
      type: "all",
      data: {
        imageData: imageData,
        settings: settings,
      },
    };
    workerRef.current?.postMessage(workData);
    setLoading(true);
  }, [detailsContext?.imageData, setLoading]);

  useEffect(() => {
    if (workerRef.current) {
      outlineOf();
    }
  }, [outlineOf]);

  return (
    <>
      <OpenCvDebugger
        dictionary={dictionary}
        stepResults={stepResults}
      ></OpenCvDebugger>
    </>
  );
};
