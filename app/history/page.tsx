import { getDictionary } from "../dictionaries";
import History from "@/components/history/History";

const HistoryPage = async () => {
  const dictionary = await getDictionary("en");

  return (
    <>
      <h1 className="text-center p-2 mb-2">{dictionary.history.title}</h1>
      <History dictionary={dictionary}></History>{" "}
    </>
  );
};

export default HistoryPage;
