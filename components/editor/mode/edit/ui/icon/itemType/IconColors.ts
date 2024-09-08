import ItemType from "@/lib/replicad/model/ItemType";

const COLORS = {
  [ItemType.Gridfinity]: "#DA4167",
  [ItemType.Primitive]: "#1296b6",
  [ItemType.Contour]: "#2c7d94",
  [ItemType.Group]: "",
  [ItemType.Text]: "",
};
const getColorFor = (type: ItemType) => {
  if (type != ItemType.Group) return `${COLORS[type]}`;
};

// "black":"#0D0D0E",
// "white":"#F4F7F5",

export default getColorFor;
