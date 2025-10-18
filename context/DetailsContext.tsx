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
import ContourPoints, {
  ContourOutline,
  modifyContourList,
} from "@/lib/data/contour/ContourPoints";
import { useSearchParams } from "next/navigation";
import SavedFile from "@/lib/SavedFile";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";

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
  thumbnail?: number;
};

export const contourOutlineOf = (context: Context, contourIndex: number) => {
  const index =
    contourIndex >= context.contours.length
      ? context.contours.length - 1
      : contourIndex;
  return context.contours[index];
};

export const centerPoints = (
  context: Context,
  contourPoints: ContourPoints[]
): ContourPoints[] => {
  const paperDimensions = paperDimensionsOfDetailsContext(context);
  if (contourPoints && contourPoints.length > 0) {
    const contours =
      modifyContourList(contourPoints).centerPoints(paperDimensions);
    return modifyContourList(contours).flipYPoints();
  }
  return [];
};

const DetailsProvider = ({ children }: Props) => {
  const [detailsContext, setDetailsContext] = useState<Context>();
  const [contextImagePng, setContextImagePng] = useState<ArrayBuffer>();
  const { getAll, getByID } = useIndexedDB("details");
  const { getByID: getFileById } = useIndexedDB("files");
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      const id = Number.parseInt(urlId);
      if (detailsContext?.id != id) {
        getByID(id).then((dbModel: Context) => {
          if (dbModel) {
            getFileById(dbModel.imageFile).then((savedFile: SavedFile) => {
              savedFile.blob.arrayBuffer().then((buffer) => {
                setDetailsContext(dbModel);
                setContextImagePng(buffer);
              });
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
                it.blob.arrayBuffer().then((buffer) => {
                  setDetailsContext(loadedContext);
                  setContextImagePng(buffer);
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
        contextImagePng,
        setContextImagePng,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = (): {
  detailsContext: Context;
  setDetailsContext: Dispatch<SetStateAction<Context>>;
  contextImagePng: ArrayBuffer;
  setContextImagePng: Dispatch<SetStateAction<ArrayBuffer>>;
} => useContext(DetailsContext);

export default DetailsProvider;
