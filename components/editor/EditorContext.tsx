import React, { createContext, useContext, useState, ReactNode } from "react";
import EditorMode from "./mode/EditorMode";
import ContourIndex from "./mode/contour/ContourIndex";

type EditorContextType = {
  editorMode: EditorMode;
  setEditorMode: React.Dispatch<React.SetStateAction<EditorMode>>;
  disableCamera: boolean;
  setDisableCamera: React.Dispatch<React.SetStateAction<boolean>>;
  wireframe: boolean;
  setWireframe: React.Dispatch<React.SetStateAction<boolean>>;
  selectedId: string | undefined;
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedPoint: ContourIndex | undefined;
  setSelectedPoint: React.Dispatch<
    React.SetStateAction<ContourIndex | undefined>
  >;
  inputFieldFocused: boolean;
  setInputFieldFocused: React.Dispatch<React.SetStateAction<boolean>>;
  transformEditFocused: boolean;
  setTransformEditFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.EDIT);
  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedPoint, setSelectedPoint] = useState<ContourIndex>();
  const [inputFieldFocused, setInputFieldFocused] = useState(false);

  const [transformEditFocused, setTransformEditFocused] = useState(false);

  return (
    <EditorContext.Provider
      value={{
        editorMode,
        setEditorMode,
        disableCamera,
        setDisableCamera,
        wireframe,
        setWireframe,
        selectedId,
        setSelectedId,
        selectedPoint,
        setSelectedPoint,
        inputFieldFocused,
        setInputFieldFocused,
        transformEditFocused,
        setTransformEditFocused,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
