import SplitCut from "@/lib/replicad/model/item/gridfinity/SplitCut";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import ItemType from "@/lib/replicad/model/ItemType";
import { SplitModification } from "@/lib/replicad/model/item/gridfinity/Modification";
import EditorHistoryType from "../../history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import deepEqual from "@/lib/utils/Objects";
import ModelData from "@/lib/replicad/model/ModelData";

type GridfinitySplitContextType = {
  highlighted: SplitCut | undefined;
  setHighlighted: React.Dispatch<React.SetStateAction<SplitCut | undefined>>;

  selected: SplitCut[];
  setSelected: React.Dispatch<React.SetStateAction<SplitCut[]>>;
};

const GridfinitySplitContext = createContext<
  GridfinitySplitContextType | undefined
>(undefined);

const getSplitItem = (modelData: ModelData) => {
  const gridfinity = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  );
  const split = gridfinity?.modifications.find(
    (it) => it.type == ItemType.GridfinitySplit
  ) as Item & SplitModification;
  return split;
};

export const GridfinitySplitContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [highlighted, setHighlighted] = useState<SplitCut | undefined>();
  const [selected, setSelected] = useState<SplitCut[]>([]);

  const { modelData, setModelData } = useModelDataContext();

  useEffect(() => {
    const split = getSplitItem(modelData);
    if (split && split.cuts.length > 0 && selected.length == 0) {
      setSelected(split.cuts);
    }
  }, [modelData, selected.length]);

  useEffect(() => {
    const { updateItem } = forModelData(modelData);
    const split = getSplitItem(modelData);
    if (split && !deepEqual(split.cuts, selected)) {
      const updatedSplit = { ...split, cuts: selected };
      setModelData(
        updateItem(updatedSplit),
        EditorHistoryType.OBJ_UPDATED,
        updatedSplit.id
      );
    }
  }, [modelData, selected, setModelData]);

  return (
    <GridfinitySplitContext.Provider
      value={{
        highlighted: highlighted,
        setHighlighted: setHighlighted,
        selected: selected,
        setSelected: setSelected,
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
