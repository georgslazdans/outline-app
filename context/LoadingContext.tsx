"use client";

import { Dictionary } from "@/app/dictionaries";
import { Loading } from "@/components/Loading";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

const LoadingContext = createContext<any>(null);

type Props = {
  dictionary: Dictionary;
  children: ReactNode;
};

export const LoadingProvider = ({ children, dictionary }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Loading dictionary={dictionary}></Loading>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
} => useContext(LoadingContext);
