"use client";

import React, { ReactNode } from "react";

type Props = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

const IconButton = ({ onClick, children, className }: Props) => {
  return (
    <button
      id="draw-outline-button"
      onClick={onClick}
      className={`flex items-center border-4 rounded-full 
        text-white dark:text-black border-white dark:border-black bg-black dark:bg-white 
        hover:text-neutral-500 hover:border-neutral-500 ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
