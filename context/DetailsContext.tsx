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
import { useSearchParams } from "next/navigation";

const DetailsContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export type Context = {
  id?: number;
  imageFile: Blob;
  details: Details;
  contours: ContourPoints[];
  settings: Settings;
  addDate: Date;
  paperImage?: Blob;
};

const DetailsProvider = ({ children }: Props) => {
  const [detailsContext, setDetailsContext] = useState<Context>();
  const [contextImageData, setContextImageData] = useState<ImageData>();
  const { getAll, getByID } = useIndexedDB("details");
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      const id = Number.parseInt(urlId);
      if (detailsContext?.id != id) {
        getByID(id).then((dbModel) => {
          if (dbModel) {
            getImageData(dbModel.imageFile).then((data) => {
              setDetailsContext(dbModel);
              setContextImageData(data);
            });
          }
        });
      }
    } else {
      if (!detailsContext) {
        getAll().then((allContexts) => {
          if (allContexts && allContexts.length > 0) {
            const loadedContext = allContexts.pop();
            getImageData(loadedContext.imageFile).then(
              (data) => {
                setDetailsContext(loadedContext);
                setContextImageData(data);
              }
            );
          }
        });
      }
    }
  }, [getAll, getByID, detailsContext, searchParams]);

  return (
    <DetailsContext.Provider
      value={{
        detailsContext,
        setDetailsContext,
        contextImageData,
        setContextImageData,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = (): {
  detailsContext: Context;
  setDetailsContext: Dispatch<SetStateAction<Context>>;
  contextImageData: ImageData;
  setContextImageData: Dispatch<SetStateAction<ImageData>>;
} => useContext(DetailsContext);

export default DetailsProvider;
