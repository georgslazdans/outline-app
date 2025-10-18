import { useCallback, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Button from "../Button";
import { downloadFile } from "@/lib/utils/Download";

type Props = {
  className?: string;
  pngBuffer?: ArrayBuffer;
  showDownload?: boolean;
};
export const PngImageViewer = ({
  pngBuffer,
  className,
  showDownload = false,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback(async () => {
    if (!pngBuffer || pngBuffer.byteLength === 0) return;
    const blob = new Blob([pngBuffer], { type: "image/png" });
    const bitmap = await createImageBitmap(blob);

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(bitmap, 0, 0);
  }, [pngBuffer]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && pngBuffer) {
      canvas.toBlob((blob) => {
        downloadFile(blob!, "TestImage.png");
      });
    }
  }, [pngBuffer]);

  return (
    <div className={className}>
      <TransformWrapper>
        <TransformComponent wrapperClass="!mx-auto">
          <canvas
            id="image-viewer"
            className="max-w-full max-h-[40vh] mx-auto"
            ref={canvasRef}
          />
        </TransformComponent>
      </TransformWrapper>
      {showDownload && (
        <Button onClick={downloadImage} className="mt-2">
          <label>Download Image</label>
        </Button>
      )}
    </div>
  );
};
