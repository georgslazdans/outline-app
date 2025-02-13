import SplitCut, {
  forSplitCut,
  splitCutUsing,
} from "@/lib/replicad/model/item/gridfinity/SplitCut";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import ItemType from "@/lib/replicad/model/ItemType";
import { SplitModification } from "@/lib/replicad/model/item/gridfinity/Modification";
import EditorHistoryType from "../../history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import deepEqual from "@/lib/utils/Objects";
import ModelData from "@/lib/replicad/model/ModelData";
import Point from "@/lib/data/Point";
import Gridfinity from "@/lib/replicad/model/item/gridfinity/Gridfinity";

export type highlight = {
  splitCut: SplitCut;
  mousePoint: Point;
};

type GridfinitySplitContextType = {
  highlighted: SplitCut | undefined;
  setHighlighted: React.Dispatch<React.SetStateAction<highlight | undefined>>;

  selected: SplitCut[];
  setSelected: (splitCuts: SplitCut[]) => void;
};

const GridfinitySplitContext = createContext<
  GridfinitySplitContextType | undefined
>(undefined);

const getSplitItem = (modelData: ModelData) => {
  const gridfinity = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  ) as Item & Gridfinity;
  const split = gridfinity?.modifications?.find(
    (it) => it.type == ItemType.GridfinitySplit
  ) as Item & SplitModification;
  return split;
};

export const GridfinitySplitContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [highlighted, setHighlighted] = useState<highlight | undefined>();
  const [selected, setSelected] = useState<SplitCut[]>([]);

  const { modelData, setModelData } = useModelDataContext();

  useEffect(() => {
    const split = getSplitItem(modelData);
    if (split && !deepEqual(split.cuts, selected)) {
      setSelected(split.cuts);
    }
  }, [modelData, selected]);

  const updateHighlight = useCallback(
    (modelData: ModelData, splitCuts: SplitCut[]) => {
      const gridfinity = modelData.items.find(
        (it) => it.type == ItemType.Gridfinity
      ) as Item & Gridfinity;
      const gridfinityParams = gridfinity?.params;
      if (gridfinityParams && highlighted) {
        const { xSize, ySize } = gridfinityParams;
        const { x, y } = highlighted.mousePoint;
        if (forSplitCut(highlighted.splitCut).isHorizontal()) {
          const cut = splitCutUsing(xSize, ySize, splitCuts).createHorizontal(
            x,
            y
          );
          setHighlighted({
            splitCut: cut,
            mousePoint: { x, y },
          });
        } else {
          const cut = splitCutUsing(xSize, ySize, splitCuts).createVertical(
            x,
            y
          );
          setHighlighted({
            splitCut: cut,
            mousePoint: { x, y },
          });
        }
      }
    },
    [highlighted]
  );

  const updateSelected = useCallback(
    (splitCuts: SplitCut[]) => {
      const { updateItem } = forModelData(modelData);
      const split = getSplitItem(modelData);
      const updatedSplit = { ...split, cuts: splitCuts };
      setModelData(
        updateItem(updatedSplit),
        EditorHistoryType.OBJ_UPDATED,
        updatedSplit.id
      );
      updateHighlight(modelData, splitCuts);
    },
    [modelData, setModelData, updateHighlight]
  );

  return (
    <GridfinitySplitContext.Provider
      value={{
        highlighted: highlighted?.splitCut,
        setHighlighted: setHighlighted,
        selected: selected,
        setSelected: updateSelected,
      }}
    >
      {children}
    </GridfinitySplitContext.Provider>
  );
};

export const useGridfinitySplitContext = (): GridfinitySplitContextType => {
  const context = useContext(GridfinitySplitContext);
  if (context === undefined) {
    throw new Error(
      "useGridfinitySplitContext must be used within an GridfinitySplitContextProvider"
    );
  }
  return context;
};
