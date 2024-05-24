"use client";

import React, { ChangeEventHandler, FormEventHandler, ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
  onClick?: FormEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button" | undefined;
};

const Button = ({ className, children, onClick, type }: Props) => {
  return (
    <button
      type={type ? type : "submit"}
      className={
        "bg-black dark:bg-white rounded-[64px] p-4 w-full text-white dark:text-black" +
        " " +
        className
      }
      onClick={(event) => onClick && onClick(event)}
    >
      {children}
    </button>
  );
};

export default Button;
