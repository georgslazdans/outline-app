"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { ModelData } from "@/lib/replicad/ModelData";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
};

const SaveModel = ({ dictionary, modelData }: Props) => {
  const { add } = useIndexedDB("models");

  const onSaveModel = () => {
    // add.
  }
  return (
    <>
      <Button className="mt-2" onClick={onSaveModel}>
        <label>Save Model</label>
      </Button>
    </>
  );
};

export default SaveModel;
