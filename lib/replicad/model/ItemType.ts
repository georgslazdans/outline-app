enum ItemType {
  Primitive = "primitive",
  Contour = "contour",
  Gridfinity = "gridfinity",
  Group = "group",
  Text = "text",
  GridfinitySplit = "gridfinity-split",
}

export const nameItemTypeOf = (item: ItemType): string => {
  const nameParts = item.valueOf().split("-");
  return nameParts.map(it => {
    return it.charAt(0).toUpperCase() + it.slice(1);
  }).join(" ");
}

export default ItemType;
