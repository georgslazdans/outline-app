import ModelData from "../ModelData";
import moveModificationsFor from "./move";
import itemModificationsFor from "./item";

const modificationsFor = (data: ModelData) => {
  return {
    ...itemModificationsFor(data),
    ...moveModificationsFor(data),
  };
};

export default modificationsFor;
