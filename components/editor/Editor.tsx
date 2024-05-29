"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useDetails } from "@/context/DetailsContext";
import Settings from "@/lib/opencv/Settings";
import PaperSize from "@/lib/PaperSize";
import Orientation from "@/lib/Orientation";

type Props = {
  dictionary: any;
};

export const Editor = ({ dictionary }: Props) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker>();

  const [outline, setOutline] = useState({
    imageData: new ImageData(1, 1),
    svg: "",
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

  const imageData =
    detailsContext?.imageData ||
    (typeof window !== "undefined" ? new ImageData(4, 4) : null);
  const settings: Settings = {
    blurWidth: 5,
    threshold1: 75,
    threshold2: 200,
    paper: {
      size: PaperSize.A4,
      orientation: Orientation.PORTRAIT,
    },
  };

  const outlineOf = useCallback(async () => {
    workerRef.current?.postMessage({ imageData, settings });
  }, []);

  useEffect(() => {
    if (workerRef.current) {
      outlineOf();
    }
    const drawImage = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      // TODO outline needs to be of some type
      if (canvas && ctx && outline) {
        console.log("Drawing image", outline)
        ctx.putImageData(outline.imageData, 0, 0);
      }
    };

    drawImage();
  }, [outline, outlineOf]);

  return (
    <>
      <div>
        <span>Is processing: </span>
      </div>
      <p>{detailsContext && JSON.stringify(detailsContext.details)}</p>
      <canvas ref={canvasRef} />
    </>
  );
};
