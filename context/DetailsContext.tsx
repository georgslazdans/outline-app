"use client";

import Details from "@/lib/Details";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

const DetailsContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export type Context = {
  imageFile: Blob;
  imageData: ImageData;
  details: Details;
};

export const DetailsProvider = ({ children }: Props) => {
  const [detailsContext, setDetailsContext] = useState<Context>();

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
