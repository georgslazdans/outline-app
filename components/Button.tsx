import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

const Button = ({ className, children }: Props) => {
  return (
    <button
      className={
        "bg-black dark:bg-white rounded-[64px] p-4 w-full text-white dark:text-black" +
        " " +
        className
      }
    >
      {children}
    </button>
  );
};

export default Button;
