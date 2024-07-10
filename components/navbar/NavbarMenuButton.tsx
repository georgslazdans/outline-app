"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";

type Props = {
  dictionary: Dictionary;
  onClick: () => void;
};

const NavbarMenuButton = ({ dictionary, onClick }: Props) => {
  return (
    <>
      <button
        onClick={onClick}
        className="ml-auto mt-1 mr-1 flex items-center 
        px-4 py-4 border-4 rounded-full 
        text-white dark:text-black border-white dark:border-black bg-black dark:bg-white 
        hover:text-neutral-500 hover:border-neutral-500"
      >
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
      </button>
    </>
  );
};

export default NavbarMenuButton;
