"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  dictionary: Dictionary;
  id: string;
  onClick: () => void;
  icon?: ReactNode;
  label?: string;
  tooltip?: string;
};

const ActionButton = ({
  id,
  onClick,
  icon,
  label,
  tooltip,
  dictionary,
}: Props) => {
  return (
    <>
      <Button
        id={id}
        onClick={onClick}
        style="secondary"
        size="medium"
        className="w-24 hover:bg-gray"
      >
        <div className="size-12 mx-auto">{icon}</div>
        <span>{label}</span>
        {tooltip && (
          <Tooltip anchorSelect={"#" + id} place="top">
            {tooltip}
          </Tooltip>
        )}
      </Button>
    </>
  );
};

export default ActionButton;
