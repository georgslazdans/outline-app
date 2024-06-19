"use client";

import React, { ChangeEventHandler, FormEventHandler, ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
  onClick?: FormEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button";
  style?: "primary" | "secondary" | "red" | "disabled";
};

const STYLES = {
  primary: "bg-black dark:bg-white text-white dark:text-black",
  secondary:
    "bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white",
  red: "bg-white dark:bg-black text-red border-4 border-red",
  disabled: "bg-white dark:bg-black text-gray border-4 border-gray",
};

const Button = ({ className, children, onClick, type, style }: Props) => {
  const buttonStyle = style ? STYLES[style] : STYLES["primary"];
  return (
    <button
      type={type ? type : "submit"}
      className={"rounded-[64px] p-4 w-full " + buttonStyle + " " + className}
      onClick={(event) => onClick && onClick(event)}
    >
      {children}
    </button>
  );
};

export default Button;
