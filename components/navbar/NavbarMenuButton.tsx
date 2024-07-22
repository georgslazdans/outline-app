"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import IconButton from "../IconButton";

type Props = {
  dictionary: Dictionary;
  onClick: () => void;
};

const NavbarMenuButton = ({ dictionary, onClick }: Props) => {
  return (
    <>
      <IconButton className="absolute ml-auto mt-1 mr-1 p-4" onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <title>{dictionary.menu}</title>

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </IconButton>
    </>
  );
};

export default NavbarMenuButton;
