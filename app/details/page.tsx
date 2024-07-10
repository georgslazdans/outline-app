import { getDictionary } from "../dictionaries";
import DetailsForm from "@/components/details/DetailsForm";

export default async function Details() {
  const dictionary = await getDictionary("en");

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <h1 className="text-center p-2">{dictionary.details.title}</h1>
        <DetailsForm dictionary={dictionary}></DetailsForm>
      </div>
    </main>
  );
}
