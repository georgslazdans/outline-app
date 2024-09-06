import { ThreeEvent } from "@react-three/fiber";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import PointClickMode from "./PointClickMode";
import usePointSelection from "./handler/PointSelectionHandler";
import useContourSplitting from "./handler/ContourSplitHandler";
import SplitPoints from "./SplitPoints";

export type PointClickHandler = {
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void;
};

type PointClickContextProps = {
  clickMode: PointClickMode;
  setClickMode: (mode: PointClickMode) => void;
  splitPoints: SplitPoints[];
  setSplitPoints: React.Dispatch<React.SetStateAction<SplitPoints[]>>;
} & PointClickHandler;

const PointClickContext = createContext<PointClickContextProps | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

const PointClickProvider = ({ children }: Props) => {
  const [clickMode, setClickMode] = useState<PointClickMode>(
    PointClickMode.SELECTION
  );

  const pointSelection: PointClickHandler = usePointSelection();

  const [splitPoints, setSplitPoints] = useState<SplitPoints[]>([]);
  const contourSplit: PointClickHandler = useContourSplitting({
    splitPoints,
    setSplitPoints,
  });

  const currentHandler = useMemo(() => {
    let handler = {
      onPointerDown: (event: ThreeEvent<PointerEvent>) => {},
      onPointerUp: (event: ThreeEvent<PointerEvent>) => {},
    };
    if (clickMode == PointClickMode.SELECTION) {
      handler = pointSelection;
    } else if (clickMode == PointClickMode.SPLIT) {
      handler = contourSplit;
    }
    return handler;
  }, [clickMode, contourSplit, pointSelection]);

  const onPointerDown = currentHandler.onPointerDown;
  const onPointerUp = currentHandler.onPointerUp;

  return (
    <PointClickContext.Provider
      value={{
        onPointerDown,
        onPointerUp,
        clickMode,
        setClickMode,
        splitPoints,
        setSplitPoints,
      }}
    >
      {children}
    </PointClickContext.Provider>
  );
};

export const usePointClickContext = (): PointClickContextProps => {
  const context = useContext(PointClickContext);
  if (!context) {
    throw new Error(
      "usePointClickContext must be used within a PointClickProvider"
    );
  }
  return context;
};

export default PointClickProvider;
