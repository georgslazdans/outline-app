import { useCallback, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Button from "../Button";
import { downloadFile } from "@/lib/utils/Download";

type Props = {
  className?: string;
  imageData?: ImageData;
  showDownload?: boolean;
};
export const ImageViewer = ({
  imageData,
  className,
  showDownload = false,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d", { willReadFrequently: true });
  };

  const drawImage = useCallback(() => {
    const ctx = getContext();
    if (ctx && imageData) {
      ctx.putImageData(imageData, 0, 0);
    }
  }, [imageData]);

  useEffect(() => {
    drawImage();
  });

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && imageData) {
      canvas.toBlob((blob) => {
        downloadFile(blob!, "TestImage.png");
      });
    }
  }, [imageData]);

  return (
    <div className={className}>
      <TransformWrapper>
        <TransformComponent wrapperClass="!mx-auto">
          <canvas
            id="image-viewer"
            className="max-w-full max-h-[40vh] mx-auto"
            ref={canvasRef}
            width={imageData?.width}
            height={imageData?.height}
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
