"use client";

import ItemType from "@/lib/replicad/model/ItemType";
import React from "react";
import getColorFor from "./IconColors";
import getIconFor from "./Icons";

type Props = {
  itemType: ItemType;
};

const ItemTypeIcon = ({ itemType }: Props) => {
  return (
    <div style={{ color: getColorFor(itemType) }}>{getIconFor(itemType)}</div>
  );
};

export default ItemTypeIcon;
