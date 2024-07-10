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
      console.log("click", nav);
      router.push(nav.path);
    };
  };

  return (
    <div className="border-b-8 border-black dark:border-white bg-white dark:bg-black">
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
    </div>
  );
};

export default NavbarMenu;
