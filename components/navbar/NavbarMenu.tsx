"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import navbarPaths, { NavbarPath } from "./NavbarPaths";
import { usePathname, useRouter } from "next/navigation";

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
              className={`mx-2 p-4 ${pathname == it.path ? "underline" : ""}`}
              onClick={onNavigation(it)}
            >
              <a
                href={it.path}
                aria-current={pathname == it.path ? "page" : "false"}
              >
                {/* {it.name} */}
                <label>{it.name}</label>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavbarMenu;
