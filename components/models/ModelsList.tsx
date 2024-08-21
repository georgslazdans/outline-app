"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import InputField from "../fields/InputField";
import Model from "@/lib/Model";
import Entry from "./Entry";

type Props = {
  dictionary: Dictionary;
};

const ModelsList = ({ dictionary }: Props) => {
  const { getAll } = useIndexedDB("models");
  const [items, setItems] = useState<Model[]>([]);
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filter = (nodes: Model[]) => {
    return nodes.filter((it) => {
      const name = it.name || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  };

  const refreshData = useCallback(() => {
    getAll().then((allModels) => {
      if (allModels && allModels.length > 0) {
        setItems(allModels);
      }
    });
  }, [getAll]);

  useEffect(() => {
    refreshData();
  }, []);

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
                model={it}
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

export default ModelsList;
