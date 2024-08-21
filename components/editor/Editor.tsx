"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

import { ModelCacheProvider } from "./cache/ModelCacheContext";
import { EditorProvider } from "./EditorContext";
import EditorComponent from "./EditorComponent";

type Props = {
  dictionary: Dictionary;
};

const Editor = ({ dictionary }: Props) => {
  return (
    <>
      <EditorProvider>
        <ModelCacheProvider>
          <EditorComponent dictionary={dictionary}>

          </EditorComponent>
        </ModelCacheProvider>
      </EditorProvider>
    </>
  );
};

export default Editor;
