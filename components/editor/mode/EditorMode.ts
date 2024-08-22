import { ReactNode } from "react";

enum EditorMode {
  EDIT,
  CONTOUR_EDIT,
  RESULT,
}

export type EditorModeConfig = {
  view: () => JSX.Element;
  toolbar: () => JSX.Element;
};

export default EditorMode;
