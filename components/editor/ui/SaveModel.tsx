"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { useModelContext } from "../../../context/ModelContext";
import { useLoading } from "@/context/LoadingContext";
import { useEditorContext } from "../EditorContext";

type Props = {
  dictionary: Dictionary;
};

const SaveModel = ({ dictionary }: Props) => {
  const { add, update } = useIndexedDB("models");

  const { inputFieldFocused } = useEditorContext();
  const { model, setModel } = useModelContext();
  const { loading, setLoading } = useLoading();

  const onSaveModel = () => {
    console.log("Saving model!");
    setLoading(true);
    if (model.id) {
      update(model).then(
        () => {
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      add(model).then(
        (dbId) => {
          setModel({ ...model, id: dbId });
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    }
  };
  return (
    <>
      <Button
        className="mt-2"
        onClick={onSaveModel}
        hotkey={!inputFieldFocused ? "s" : undefined}
        hotkeyCtrl={!inputFieldFocused ? true : undefined}
      >
        <label>Save Model</label>
      </Button>
    </>
  );
};

export default SaveModel;
