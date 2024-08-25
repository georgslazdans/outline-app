"use client";

import React, { FormEventHandler, ReactNode, useEffect } from "react";

type Props = {
  id?: string;
  className?: string;
  children?: ReactNode;
  onClick?: FormEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button";
  style?: "primary" | "secondary" | "red" | "disabled";
  hotkey?: string;
  hotkeyCtrl?: boolean;
};

const STYLES = {
  primary: "bg-black dark:bg-white text-white dark:text-black",
  secondary:
    "bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white",
  red: "bg-white dark:bg-black text-red border-4 border-red",
  disabled: "bg-white dark:bg-black text-gray border-4 border-gray",
};

const Button = ({
  id,
  className,
  children,
  onClick,
  type,
  style,
  hotkey,
  hotkeyCtrl,
}: Props) => {
  const buttonStyle = style ? STYLES[style] : STYLES["primary"];

  useEffect(() => {
    const handleControlKey = (event: KeyboardEvent) =>
      hotkeyCtrl ? event.ctrlKey : true;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (hotkey && event.key === hotkey && handleControlKey(event)) {
        if (onClick) {
          event.preventDefault();
          onClick(event as any); // Trigger the onClick function
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hotkey, hotkeyCtrl, onClick]);

  return (
    <button
      id={id}
      type={type ? type : "submit"}
      className={"rounded-[64px] p-4 w-full " + buttonStyle + " " + className}
      onClick={(event) => onClick && onClick(event)}
    >
      {children}
    </button>
  );
};

export default Button;
