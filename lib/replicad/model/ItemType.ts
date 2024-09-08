enum ItemType {
  Primitive = "primitive",
  Contour = "contour",
  Gridfinity = "gridfinity",
  Group = "group",
  Text = "text",
}

export const nameItemTypeOf = (item: ItemType): string => {
  const itemType = item.valueOf();
  return itemType.charAt(0).toUpperCase() + itemType.slice(1);
}

export default ItemType;
