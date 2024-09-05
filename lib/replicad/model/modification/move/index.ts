import ModelData from "../../ModelData";
import reorderItems from "../item/ReorderItems";
import moveToGroup from "./MoveToGroup";
import moveToNewGroup from "./MoveToNewGroup";
import moveToRoot from "./MoveToRoot";

const moveModificationsFor = (data: ModelData) => {
  return {
    reorderItems: reorderItems(data),
    moveToNewGroup: moveToNewGroup(data),
    moveToGroup: moveToGroup(data),
    moveToRoot: moveToRoot(data)
  };
};

export default moveModificationsFor;
