"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useDetails } from "@/context/DetailsContext";
import Settings from "@/lib/opencv/Settings";
import PaperSize from "@/lib/PaperSize";
import Orientation from "@/lib/Orientation";
import { ImageSelector } from "./ImageSelector";
import { IntermediateData } from "@/lib/opencv/ImageProcessor";

type Props = {
  dictionary: any;
};

export const Editor = ({ dictionary }: Props) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker>();
  const [currentImageData, setCurrentImageData] = useState<ImageData>(new ImageData(1, 1));

  const [outline, setOutline] = useState({
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
    const drawImage = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      // TODO outline needs to be of some type
      if (canvas && ctx && outline) {
        console.log("Drawing image", outline);
        ctx.putImageData(outline.imageData, 0, 0);
        setCurrentImageData(outline.imageData);
      }
    };

    drawImage();
  }, [outline, outlineOf]);

  const handleDataChange = (data: IntermediateData) => {
    const drawImage = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (canvas && ctx) {
        ctx.putImageData(data.imageData, 0, 0);
        setCurrentImageData(data.imageData);
      }
    };
    drawImage();
  };

  return (
    <>
      <div>
        <span>Is processing: </span>
      </div>
      <p>{detailsContext && JSON.stringify(detailsContext.details)}</p>
      <ImageSelector
        imageData={outline.intermediateData}
        onDataChange={handleDataChange}
      ></ImageSelector>
      <canvas
        className="max-w-full max-h-[80vh]"
        ref={canvasRef}
        width={currentImageData.width}
        height={currentImageData.height}
      />
    </>
  );
};
