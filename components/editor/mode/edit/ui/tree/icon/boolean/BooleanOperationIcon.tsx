"use client";

import React from "react";
import getIconFor from "./Icons";
import BooleanOperation from "@/lib/replicad/model/BooleanOperation";

type Props = {
  operation: BooleanOperation;
  className?: string;
};

const BooleanOperationIcon = ({ operation, className }: Props) => {
  return (
    <div className={"text-black dark:text-white stroke-black dark:stroke-white " + className}>
      {getIconFor(operation)}
    </div>
  );
};

export default BooleanOperationIcon;
