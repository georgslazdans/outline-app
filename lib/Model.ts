import ModelData from "./replicad/model/ModelData";

type Model = {
  id?: number;
  name: string;
  modelData: ModelData;
  addDate: Date;
  imageFile?: number;
};

export default Model;
