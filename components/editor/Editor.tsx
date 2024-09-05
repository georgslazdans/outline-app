"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

import { ModelCacheProvider } from "./cache/ModelCacheContext";
import { EditorProvider } from "./EditorContext";
import EditorComponent from "./EditorComponent";
import { ContourCacheProvider } from "./cache/ContourCacheContext";
import { EditorHistoryProvider } from "./history/EditorHistoryContext";
import { ModelDataProvider } from "./ModelDataContext";
import { ModelLoadingIndicatorProvider } from "./cache/ModelLoadingIndicatorContext";

type Props = {
  dictionary: Dictionary;
};

const Editor = ({ dictionary }: Props) => {
  return (
    <>
      <EditorProvider>
        <ContourCacheProvider>
          <ModelLoadingIndicatorProvider>
            <ModelCacheProvider>
              <EditorHistoryProvider>
                <ModelDataProvider>
                  <EditorComponent dictionary={dictionary}></EditorComponent>
                </ModelDataProvider>
              </EditorHistoryProvider>
            </ModelCacheProvider>
          </ModelLoadingIndicatorProvider>
        </ContourCacheProvider>
      </EditorProvider>
    </>
  );
};

export default Editor;
