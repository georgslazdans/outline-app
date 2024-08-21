"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { useModelContext } from "../../../context/ModelContext";

type Props = {
  dictionary: Dictionary;
};

const SaveModel = ({ dictionary }: Props) => {
  const { add, update } = useIndexedDB("models");

  const { model, setModel } = useModelContext();

  const onSaveModel = () => {
    if (model.id) {
      update(model).then(
        () => {},
        (error) => console.error(error)
      );
    } else {
      add(model).then(
        (dbId) => {
          setModel({ ...model, id: dbId });
        },
        (error) => console.error(error)
      );
    }
  };
  return (
    <>
      <Button className="mt-2" onClick={onSaveModel}>
        <label>Save Model</label>
      </Button>
    </>
  );
};

export default SaveModel;
