"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

import { ModelCacheProvider } from "./cache/ModelCacheContext";
import { EditorProvider } from "./EditorContext";
import EditorComponent from "./EditorComponent";
import { ModelProvider } from "./ModelContext";

type Props = {
  dictionary: Dictionary;
};

const Editor = ({ dictionary }: Props) => {
  return (
    <>
      <ModelProvider>
        <EditorProvider>
          <ModelCacheProvider>
            <EditorComponent dictionary={dictionary}></EditorComponent>
          </ModelCacheProvider>
        </EditorProvider>
      </ModelProvider>
    </>
  );
};

export default Editor;
