"use client";

import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import { SplitModification } from "@/lib/replicad/model/item/gridfinity/Modification";
import ItemType from "@/lib/replicad/model/ItemType";
import GridfinityGrid from "./grid/GridfinityGrid";

type Props = {
  item: Item & SplitModification;
  onItemChange: (item: Item) => void;
};

const SplitGridfinityBoxEdit = ({ item, onItemChange }: Props) => {
  const { modelData } = useModelDataContext();
  const gridfinity = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  );

  return (
    <>
      <h2 className="">Split Grid</h2>
      <div className="p-4">
        <GridfinityGrid
          xCount={gridfinity!.params.xSize}
          yCount={gridfinity!.params.ySize}
        ></GridfinityGrid>
      </div>
    </>
  );
};

export default SplitGridfinityBoxEdit;
