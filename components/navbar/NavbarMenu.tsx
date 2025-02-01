"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import navbarPaths, { NavbarPath } from "./NavbarPaths";
import { usePathname, useRouter } from "next/navigation";
import Version from "../Version";

type Props = {
  dictionary: Dictionary;
};

const NavbarMenu = ({ dictionary }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const paths = navbarPaths(dictionary);

  const onNavigation = (nav: NavbarPath) => {
    return () => {
      router.push(nav.path);
    };
  };

  return (
    <div className="border-b-4 xl:border-b border-black dark:border-white bg-white dark:bg-black">
      <ul className="list-image-none flex flex-col xl:flex-row xl:max-w-5xl xl:mx-auto">
        {paths.map((it) => {
          return (
            <li
              key={it.path}
              className={`cursor-pointer mx-2 p-4 ${
                pathname == it.path ? "underline" : ""
              }`}
              onClick={onNavigation(it)}
            >
              <a
                className="cursor-pointer"
                href={it.path}
                aria-current={pathname == it.path ? "page" : "false"}
              >
                {/* {it.name} */}
                <label className="cursor-pointer">{it.name}</label>
              </a>
            </li>
          );
        })}

        <Version></Version>
      </ul>
    </div>
  );
};

export default NavbarMenu;
