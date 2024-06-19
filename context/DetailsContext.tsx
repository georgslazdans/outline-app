"use client";

import Details from "@/lib/Details";
import deepEqual from "@/lib/utils/Objects";
import Settings from "@/lib/opencv/Settings";
import { useRouter } from "next/navigation";
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

const DetailsContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export type Context = {
  id?: number;
  imageFile: Blob;
  imageData: ImageData;
  details: Details;
  settings: Settings;
  addDate: Date;
};

const DetailsProvider = ({ children }: Props) => {
  const router = useRouter();
  const [detailsContext, setDetailsContext] = useState<Context>();
  const { getAll } = useIndexedDB("details");

  useEffect(() => {
    if (!detailsContext) {
      getAll().then((allContexts) => {
        if (allContexts && allContexts.length > 0) {
          const loadedContext = allContexts.pop();
          setDetailsContext(loadedContext);
        } else {
          router.push("/");
        }
      });
    }
  }, [detailsContext, getAll, router]);

  return (
    <DetailsContext.Provider value={{ detailsContext, setDetailsContext }}>
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = (): {
  detailsContext: Context;
  setDetailsContext: Dispatch<SetStateAction<Context>>;
} => useContext(DetailsContext);

export default DetailsProvider;
