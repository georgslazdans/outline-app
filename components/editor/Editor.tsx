"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

import { ModelCacheProvider } from "./cache/ModelCacheContext";
import { EditorProvider } from "./EditorContext";
import EditorComponent from "./EditorComponent";
import { ContourCacheProvider } from "./cache/ContourCacheContext";
import { EditorHistoryProvider } from "./history/EditorHistoryContext";
import { ModelDataProvider } from "./ModelDataContext";

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
              <ModelDataProvider>
                <EditorComponent dictionary={dictionary}></EditorComponent>
              </ModelDataProvider>
            </EditorHistoryProvider>
          </ModelCacheProvider>
        </ContourCacheProvider>
      </EditorProvider>
    </>
  );
};

export default Editor;
