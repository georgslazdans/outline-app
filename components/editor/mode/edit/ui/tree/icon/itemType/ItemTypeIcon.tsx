"use client";

import ItemType, { nameItemTypeOf } from "@/lib/replicad/model/ItemType";
import React from "react";
import getColorFor from "./IconColors";
import getIconFor from "./Icons";
import { Tooltip } from "react-tooltip";

type Props = {
  itemType: ItemType;
  className?: string;
};

const ItemTypeIcon = ({ itemType, className }: Props) => {
  const iconClassOf = (type: ItemType) => {
    const name = type.valueOf();
    return `icon-${name} `;
  };
  return (
    <a
      className={iconClassOf(itemType) + className}
      style={{ color: getColorFor(itemType) }}
    >
      {getIconFor(itemType)}
      <Tooltip anchorSelect={"." + iconClassOf(itemType)} place="top">
        {nameItemTypeOf(itemType)}
      </Tooltip>
    </a>
  );
};

export default ItemTypeIcon;
