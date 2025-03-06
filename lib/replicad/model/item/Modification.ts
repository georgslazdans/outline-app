import Item from "../Item";
import { ShellModification } from "./contour/ShellModification";
import { SplitModification } from "./gridfinity/SplitModification";

type Modification = SplitModification | ShellModification;

export type ItemModification = Item & Modification;

export default Modification;
