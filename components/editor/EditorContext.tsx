import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import EditorMode from "./mode/EditorMode";
import ContourIndex from "../../lib/data/contour/ContourIndex";

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
  setInputFieldFocused: React.Dispatch<React.SetStateAction<boolean>>;
  transformEditFocused: boolean;
  setTransformEditFocused: React.Dispatch<React.SetStateAction<boolean>>;
  withHotkey: (
    key: string,
    hotkeyCtrl?: boolean
  ) => {
    hotkey: string;
    hotkeyCtrl: boolean | undefined;
  };
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

  const withHotkey = useCallback(
    (key: string, hotkeyCtrl?: boolean) => {
      if (inputFieldFocused || transformEditFocused) {
        return {
          hotkey: "",
          hotkeyCtrl: undefined,
        };
      } else {
        return {
          hotkey: key,
          hotkeyCtrl: hotkeyCtrl ? true : undefined,
        };
      }
    },
    [inputFieldFocused, transformEditFocused]
  );

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
        setInputFieldFocused,
        transformEditFocused,
        setTransformEditFocused,
        withHotkey,
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
