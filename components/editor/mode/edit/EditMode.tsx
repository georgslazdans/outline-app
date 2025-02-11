import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../EditorMode";
import EditCanvas from "./EditCanvas";
import EditToolbar from "./EditToolbar";
import { GridfinitySplitContextProvider } from "./GridfinitySplitContext";

type Props = {
  dictionary: Dictionary;
};

const EditMode = ({ dictionary }: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return <EditCanvas dictionary={dictionary}></EditCanvas>;
    },
    toolbar: () => {
      return <EditToolbar dictionary={dictionary}></EditToolbar>;
    },
    contextProvider: (children: JSX.Element) => {
      return (
        <GridfinitySplitContextProvider>
          {children}
        </GridfinitySplitContextProvider>
      );
    },
  };
  return mode;
};

export default EditMode;
