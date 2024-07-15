"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";
import NavbarMenuButton from "./NavbarMenuButton";
import NavbarMenu from "./NavbarMenu";
import NavbarBackButton from "./NavbarBackButton";

type Props = {
  dictionary: Dictionary;
};

const Navbar = ({ dictionary }: Props) => {
  const [showMenu, setShowMenu] = useState(false);

  const onMenuClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <div className="xl:hidden">
        <div className="fixed w-16 h-16 right-0 z-50">
          <NavbarMenuButton dictionary={dictionary} onClick={onMenuClick} />
        </div>
        <div className="w-full max-h-[80vh] fixed z-30 flex">
          {!showMenu && <NavbarBackButton dictionary={dictionary} />}
        </div>
        <div className="w-full max-h-[80vh] fixed z-40">
          {showMenu && <NavbarMenu dictionary={dictionary} />}
        </div>
      </div>
      <div className="hidden xl:block">
        <div className="w-full z-40">
          <NavbarMenu dictionary={dictionary} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
