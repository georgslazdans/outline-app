enum ItemType {
  Primitive = "primitive",
  Shadow = "shadow",
  Gridfinity = "gridfinity",
  Group = "group",
}

export const nameItemTypeOf = (item: ItemType): string => {
  const itemType = item.valueOf();
  return itemType.charAt(0).toUpperCase() + itemType.slice(1);
}

export default ItemType;
