import { getDictionary } from "../dictionaries";
import DetailsForm from "@/components/details/DetailsForm";

export default async function Details() {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2">{dictionary.details.title}</h1>
      <DetailsForm dictionary={dictionary}></DetailsForm>
    </>
  );
}
