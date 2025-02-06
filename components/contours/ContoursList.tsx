"use client";

import { Dictionary } from "@/app/dictionaries";
import { Context } from "@/context/DetailsContext";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import Entry from "./Entry";
import InputField from "../fields/InputField";

type Props = {
  dictionary: Dictionary;
};

const ContoursList = ({ dictionary }: Props) => {
  const { getAll } = useIndexedDB("details");
  const [items, setItems] = useState<Context[]>([]);
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filter = (nodes: Context[]) => {
    return nodes.filter((it) => {
      const name = it.details?.name || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  };

  const refreshData = useCallback(() => {
    getAll().then((allContexts: Context[]) => {
      if (allContexts && allContexts.length > 0) {
        setItems(allContexts.reverse());
      }
    });
  }, [getAll]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <>
      <InputField
        label={dictionary.contours.searchByName}
        name={"searchBy"}
        value={search}
        onChange={handleSearch}
      ></InputField>
      <div className="mt-4 grid grid-cols-1 gap-1 xl:gap-4 xl:grid-cols-3">
        {filter(items).map((it) => {
          return (
            <div key={it.id} className="mb-2">
              <Entry
                context={it}
                dictionary={dictionary}
                onDelete={refreshData}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ContoursList;
