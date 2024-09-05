"use client";

import { Dictionary } from "@/app/dictionaries";
import { wrap } from "module";
import React, { ReactNode } from "react";

type Props = {
  dictionary: Dictionary;
  name: string;
  children: ReactNode;
};

const ActionGroup = ({ dictionary, name, children }: Props) => {
  return (
    <div>
      <h2 className="">{name}</h2>
      <div className="ml-2 flex flex-row gap-2">{children}</div>
    </div>
  );
};

export default ActionGroup;
