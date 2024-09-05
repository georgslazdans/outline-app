import ContoursList from "@/components/contours/ContoursList";
import { getDictionary } from "../dictionaries";

const ContoursListPage = async () => {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2 mb-2">{dictionary.contours.title}</h1>
      <ContoursList dictionary={dictionary}></ContoursList>{" "}
    </>
  );
};

export default ContoursListPage;
