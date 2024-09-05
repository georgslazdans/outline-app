import Item from "@/lib/replicad/model/Item";

type GroupedItem = {
  item: Item;
  groupLevel: number;
  localIndex: number;
};

export default GroupedItem;
