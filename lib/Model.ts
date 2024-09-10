import ModelData from "./replicad/model/ModelData";

type Model = {
  id?: number;
  name: string;
  modelData: ModelData;
  addDate: Date,
  imageFile?: Blob
};

export default Model;
