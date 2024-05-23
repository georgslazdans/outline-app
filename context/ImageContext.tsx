'use client'
import { createContext, useState, useContext, ReactNode } from "react";

const ImageContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

export const ImageProvider = ({ children }: Props) => {
  const [imageFile, setImageFile] = useState<Blob>();

  return (
    <ImageContext.Provider value={{imageFile, setImageFile}}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => useContext(ImageContext);
