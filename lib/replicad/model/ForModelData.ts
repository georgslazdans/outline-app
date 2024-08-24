import ModelData from "./ModelData";
import queriesFor from "./queries";
import modificationsFor from "./modification";

export const forModelData = (data: ModelData) => {
  return {
    ...queriesFor(data),
    ...modificationsFor(data)
  };
};
