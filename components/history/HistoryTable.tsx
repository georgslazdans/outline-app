"use client";

import React, { ChangeEvent } from "react";

import { Context } from "@/context/DetailsContext";
import { Dictionary } from "@/app/dictionaries";
import InputField from "../fiields/InputField";
type Props = {
  dictionary: Dictionary;
  allContexts: Context[];
};

const HistoryTable = ({ dictionary, allContexts = [] }: Props) => {
  let data = { nodes: allContexts };


  const [search, setSearch] = React.useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };



  return (
    <>
      <InputField
        label={dictionary.history.searchByName}
        name={"searchBy"}
        value={search}
        onChange={handleSearch}
      ></InputField>
      <br />

      <br />
    </>
  );
};

export default HistoryTable;
