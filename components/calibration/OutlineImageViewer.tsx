import { useCallback, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  className?: string;
  image?: ImageData;
};
export const OutlineImageViewer = ({ className, image }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d");
  };

  const drawImage = useCallback(() => {
    const ctx = getContext();
    if (ctx && image) {
      ctx.putImageData(image, 0, 0);
    }
  }, [image]);

  useEffect(() => {
    drawImage();
  });

  return (
    <div className={className}>
      <TransformWrapper>
        <TransformComponent wrapperClass="!mx-auto">
          <canvas
            className="max-w-full max-h-[30vh]"
            ref={canvasRef}
            width={image?.width}
            height={image?.height}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
