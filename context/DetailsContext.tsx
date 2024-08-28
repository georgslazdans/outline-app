"use client";

import Details from "@/lib/Details";
import Settings from "@/lib/opencv/Settings";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef,
} from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import getImageData from "@/lib/utils/ImageData";
import ContourPoints from "@/lib/data/contour/ContourPoints";

const DetailsContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export type Context = {
  id?: number;
  imageFile: Blob;
  imageData: ImageData;
  details: Details;
  contours: ContourPoints[];
  settings: Settings;
  addDate: Date;
  paperImage?: ImageData
};

const DetailsProvider = ({ children }: Props) => {
  const [detailsContext, setDetailsContext] = useState<Context>();
  const { getAll } = useIndexedDB("details");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!detailsContext) {
      getAll().then((allContexts) => {
        if (allContexts && allContexts.length > 0) {
          const loadedContext = allContexts.pop();
          getImageData(loadedContext.imageFile, canvasRef.current).then(
            (data) => {
              setDetailsContext({ ...loadedContext, imageData: data });
            }
          );
        }
      });
    }
  }, [detailsContext, getAll]);

  return (
    <DetailsContext.Provider value={{ detailsContext, setDetailsContext }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = (): {
  detailsContext: Context;
  setDetailsContext: Dispatch<SetStateAction<Context>>;
} => useContext(DetailsContext);

export default DetailsProvider;
