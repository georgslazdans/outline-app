import ContoursList from "@/components/contours/ContoursList";
import { getDictionary } from "../dictionaries";
import ModelsList from "@/components/models/ModelsList";

const ModelsListPage = async () => {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2 mb-2">{dictionary.models.title}</h1>
      <ModelsList dictionary={dictionary}></ModelsList>{" "}
    </>
  );
};

export default ModelsListPage;
