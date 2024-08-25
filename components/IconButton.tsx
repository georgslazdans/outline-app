"use client";

import React, { ReactNode, useEffect } from "react";

type Props = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  hotkey?: string;
  hotkeyCtrl?: boolean;
  id?: string;
};

const IconButton = ({
  id,
  onClick,
  children,
  className,
  hotkey,
  hotkeyCtrl,
}: Props) => {
  useEffect(() => {
    const handleControlKey = (event: KeyboardEvent) =>
      hotkeyCtrl ? event.ctrlKey : true;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (hotkey && event.key === hotkey && handleControlKey(event)) {
        if (onClick) {
          event.preventDefault();
          onClick();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hotkey, onClick]);

  return (
    <button
      id={id}
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
