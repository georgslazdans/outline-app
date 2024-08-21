"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

import { ModelCacheProvider } from "./cache/ModelCacheContext";
import { EditorProvider } from "./EditorContext";
import EditorComponent from "./EditorComponent";
import { ContourCacheProvider } from "./cache/ContourCacheContext";

type Props = {
  dictionary: Dictionary;
};

const Editor = ({ dictionary }: Props) => {
  return (
    <>
      <EditorProvider>
        <ContourCacheProvider>
          <ModelCacheProvider>
            <EditorComponent dictionary={dictionary}></EditorComponent>
          </ModelCacheProvider>
        </ContourCacheProvider>
      </EditorProvider>
    </>
  );
};

export default Editor;
