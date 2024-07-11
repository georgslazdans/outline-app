import React from "react";
import { getDictionary } from "../dictionaries";

type Props = {};

const InfoPage = async ({}: Props) => {
  const dictionary = await getDictionary("en");

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <h1 className="text-center p-2 mb-2">{dictionary.info.title}</h1>
      </div>
    </main>
  );
};

export default InfoPage;
