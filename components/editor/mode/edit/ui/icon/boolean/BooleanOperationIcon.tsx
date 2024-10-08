"use client";

import React from "react";
import getIconFor from "./Icons";
import BooleanOperation, {
  nameOfBooleanOperation,
} from "@/lib/replicad/model/BooleanOperation";
import { Tooltip } from "react-tooltip";

type Props = {
  operation: BooleanOperation;
  className?: string;
  onClick?: () => void;
};

const BooleanOperationIcon = ({ operation, className, onClick }: Props) => {
  const iconClassOf = (operation: BooleanOperation) => {
    const name = operation.valueOf();
    return `icon-${name} `;
  };

  return (
    <a className={iconClassOf(operation) + className} onClick={onClick}>
      {getIconFor(operation)}
      <Tooltip anchorSelect={"." + iconClassOf(operation)} place="top">
        {nameOfBooleanOperation(operation)}
      </Tooltip>
    </a>
  );
};

export default BooleanOperationIcon;
