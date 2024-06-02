"use client";

import { DBConfig } from "@/lib/DbConfig";
import Details from "@/lib/Details";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { initDB, useIndexedDB } from "react-indexed-db-hook";

const DetailsContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export type Context = {
  name:string;
  imageFile: Blob;
  imageData: ImageData;
  details: Details;
};

initDB(DBConfig);


export const DetailsProvider = ({ children }: Props) => {
  const [detailsContext, setDetailsContext] = useState<Context>();
  const { getAll } = useIndexedDB("details");
  
  if (!detailsContext) {
    getAll().then((allContexts) => {    
      if (allContexts && allContexts.length > 0) {
        const loadedContext = allContexts.pop();
        setDetailsContext(loadedContext);
      }
    })
  }

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
