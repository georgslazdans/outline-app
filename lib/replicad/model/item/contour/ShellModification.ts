import ItemType from "../../ItemType";
import { ItemModification } from "../Modification";
import { v4 as randomUUID } from "uuid";

export type ShellModification = {
  type: ItemType.ContourShell;
  wallThickness: number;
};

export const newShellModification = (): ItemModification => {
  return {
    id: randomUUID(),
    name: "Shell",
    type: ItemType.ContourShell,
    wallThickness: 2,
  };
};
