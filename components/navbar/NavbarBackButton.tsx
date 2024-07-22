"use client";

import { Dictionary } from "@/app/dictionaries";
import { useRouter } from "next/navigation";
import React from "react";
import IconButton from "../IconButton";

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
      <IconButton className="absolute mr-auto mt-1 ml-1 p-4" onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <title>Back</title>

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </IconButton>
    </>
  );
};

export default NavbarBackButton;
