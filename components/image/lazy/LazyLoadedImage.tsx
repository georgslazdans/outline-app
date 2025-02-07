import { useState, useEffect, useRef } from "react";
import SavedImage from "./SavedImage";

type Props = {
  imageId?: number;
};

const LazyLoadImage = ({ imageId }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!imageId && typeof imageId != "number" ) {
    return null;
  }
  return (
    <>
      <div ref={containerRef}>
        {isVisible && <SavedImage imageId={imageId}></SavedImage>}
      </div>
    </>
  );
};

export default LazyLoadImage;
