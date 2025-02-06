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
} from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import getImageData from "@/lib/utils/ImageData";
import { ContourOutline } from "@/lib/data/contour/ContourPoints";
import { useSearchParams } from "next/navigation";
import SavedFile from "@/lib/SavedFile";

const DetailsContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export type Context = {
  id?: number;
  imageFile: number;
  details: Details;
  contours: ContourOutline[];
  settings: Settings;
  addDate: Date;
  paperImage?: number;
};

const DetailsProvider = ({ children }: Props) => {
  const [detailsContext, setDetailsContext] = useState<Context>();
  const [contextImageData, setContextImageData] = useState<ImageData>();
  const { getAll, getByID } = useIndexedDB("details");
  const { getByID: getFileById } = useIndexedDB("files");
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
        getAll().then((allContexts: Context[]) => {
          if (allContexts && allContexts.length > 0) {
            const loadedContext = allContexts.pop();
            if (loadedContext) {
              getFileById(loadedContext.imageFile).then((it: SavedFile) => {
                getImageData(it.blob).then((data) => {
                  setDetailsContext(loadedContext);
                  setContextImageData(data);
                });
              });
            }
          }
        });
      }
    }
  }, [getAll, getByID, detailsContext, searchParams, getFileById]);

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
