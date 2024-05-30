"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useDetails } from "@/context/DetailsContext";
import Settings from "@/lib/opencv/Settings";
import PaperSize from "@/lib/PaperSize";
import Orientation from "@/lib/Orientation";
import { OpenCvDebugger } from "./OpenCvDebugger";
import { OutlineResult } from "@/lib/opencv/OutlineResult";

type Props = {
  dictionary: any;
};

export const Editor = ({ dictionary }: Props) => {
  const router = useRouter();
  const workerRef = useRef<Worker>();

  const [outline, setOutline] = useState<OutlineResult>({
    imageData: new ImageData(1, 1),
    svg: "",
    intermediateData: [],
  });

  const { detailsContext } = useDetails();

  useEffect(() => {
    if (!detailsContext) {
      router.push("/");
    }
  }, [detailsContext, router]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/opencv/Worker.ts", import.meta.url)
    );
    workerRef.current.onmessage = (event) => {
      setOutline(event.data);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const outlineOf = useCallback(async () => {
    const imageData =
      detailsContext?.imageData ||
      (typeof window !== "undefined" ? new ImageData(4, 4) : null);
    const settings: Settings = {
      blurWidth: 5,
      threshold1: 100,
      threshold2: 200,
      paper: {
        size: PaperSize.A4,
        orientation: Orientation.PORTRAIT,
      },
    };

    workerRef.current?.postMessage({ imageData, settings });
  }, [detailsContext?.imageData]);

  useEffect(() => {
    if (workerRef.current) {
      outlineOf();
    }
  }, [outline, outlineOf]);

  return (
    <>
      <div>
        <span>Is processing: </span>
      </div>
      <p>{detailsContext && JSON.stringify(detailsContext.details)}</p>
      <OpenCvDebugger outline={outline}></OpenCvDebugger>
    </>
  );
};
