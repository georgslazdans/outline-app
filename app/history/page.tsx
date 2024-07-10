import { getDictionary } from "../dictionaries";
import History from "@/components/history/History";

const HistoryPage = async () => {
  const dictionary = await getDictionary("en");

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <h1 className="text-center p-2 mb-2">{dictionary.history.title}</h1>
        <History dictionary={dictionary}></History>{" "}
      </div>
    </main>
  );
};

export default HistoryPage;
