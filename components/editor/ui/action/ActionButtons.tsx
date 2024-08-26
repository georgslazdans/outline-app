"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ReactNode } from "react";

type Props = {
  dictionary: Dictionary;
  children: ReactNode;
  className?: string;
};

const ActionButtons = ({ dictionary, children, className }: Props) => {
  return (
    <div className={"mb-2 flex flex-row gap-4 " + className}>{children}</div>
  );
};

export default ActionButtons;
