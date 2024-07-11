import { Dictionary } from "@/app/dictionaries";

const navbarPaths = (dictionary: Dictionary): NavbarPath[] => {
  return [
    {
      path: "/",
      name: dictionary.homepage,
    },
    {
      path: "/history",
      name: dictionary.history.title,
    },
    // {
    //   path: "/info",
    //   name: dictionary.info.title,
    // },
  ];
};

export type NavbarPath = {
  path: string;
  name: string;
};

export default navbarPaths;
