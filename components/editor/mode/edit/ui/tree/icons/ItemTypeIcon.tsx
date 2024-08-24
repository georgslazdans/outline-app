"use client";

import ItemType from "@/lib/replicad/model/ItemType";
import React from "react";
import getColorFor from "./IconColors";
import getIconFor from "./Icons";

type Props = {
  itemType: ItemType;
  className?: string;
};

const ItemTypeIcon = ({ itemType, className }: Props) => {
  return (
    <div className={className} style={{ color: getColorFor(itemType) }}>
      {getIconFor(itemType)}
    </div>
  );
};

export default ItemTypeIcon;
