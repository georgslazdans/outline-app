import { Dictionary } from "@/app/dictionaries";
import { EditorModeConfig } from "../EditorMode";
import EditCanvas from "./EditCanvas";
import EditToolbar from "./EditToolbar";

type Props = {
  dictionary: Dictionary;
};

const EditMode = ({
  dictionary,
}: Props): EditorModeConfig => {
  const mode = {
    view: () => {
      return (
        <EditCanvas
          dictionary={dictionary}
        ></EditCanvas>
      );
    },
    toolbar: () => {
      return (
        <EditToolbar
          dictionary={dictionary}
        ></EditToolbar>
      );
    },
    contextProvider: (children: JSX.Element) => {
      return <>{children}</>;
    }
  };
  return mode;
};

export default EditMode;
