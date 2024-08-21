"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

import { ModelCacheProvider } from "./cache/ModelCacheContext";
import { EditorProvider } from "./EditorContext";
import EditorComponent from "./EditorComponent";
import { ContourCacheProvider } from "./cache/ContourCacheContext";
import { EditorHistoryProvider } from "./EditorHistoryContext";

type Props = {
  dictionary: Dictionary;
};

const Editor = ({ dictionary }: Props) => {
  return (
    <>
      <EditorProvider>
        <ContourCacheProvider>
          <ModelCacheProvider>
            <EditorHistoryProvider>
              <EditorComponent dictionary={dictionary}></EditorComponent>
            </EditorHistoryProvider>
          </ModelCacheProvider>
        </ContourCacheProvider>
      </EditorProvider>
    </>
  );
};

export default Editor;
