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
    return modifyContourList(contours).mirrorPointsOnXAxis();
  }
  return [];
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
        getByID(id).then((dbModel: Context) => {
          if (dbModel) {
            getFileById(dbModel.imageFile).then((savedFile: SavedFile) => {
              getImageData(savedFile.blob).then((data) => {
                setDetailsContext(dbModel);
                setContextImageData(data);
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
