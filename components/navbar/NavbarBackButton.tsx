"use client";

import { Dictionary } from "@/app/dictionaries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  dictionary: Dictionary;
};

const NavbarBackButton = ({ dictionary }: Props) => {
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  return (
    <>
      <button
        onClick={onClick}
        className="absolute mr-auto mt-1 ml-1 flex items-center 
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
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>
    </>
  );
};

export default NavbarBackButton;
