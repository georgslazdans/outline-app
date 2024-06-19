"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import React, { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import Entry from "./Entry";

type Props = {
  dictionary: Dictionary;
};

const History = ({ dictionary }: Props) => {
  const { getAll } = useIndexedDB("details");
  const [items, setItems] = useState<Context[]>([]);

  useEffect(() => {
    getAll().then((allContexts) => {
      if (allContexts && allContexts.length > 0) {
        setItems(allContexts);
      }
    });
  }, []);

  return (
    <>
      {items.map((it) => {
        return (
          <div key={it.id} className="mb-2">
            <Entry context={it} dictionary={dictionary} />
          </div>
        );
      })}
    </>
  );
};

export default History;
