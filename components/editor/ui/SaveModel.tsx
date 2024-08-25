"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Button from "../../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { useModelContext } from "../../../context/ModelContext";
import { useLoading } from "@/context/LoadingContext";
import { useEditorContext } from "../EditorContext";
import { Tooltip } from "react-tooltip";

type Props = {
  dictionary: Dictionary;
};

const SaveModel = ({ dictionary }: Props) => {
  const { add, update } = useIndexedDB("models");

  const { inputFieldFocused } = useEditorContext();
  const { model, setModel } = useModelContext();
  const { setLoading } = useLoading();

  const onSaveModel = () => {
    setLoading(true);
    if (model.id) {
      update(model).then(
        () => {
          console.log("Model saved!", model.id);
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
          console.log("Model saved!", model.id);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    }
  };

  const id = "save-model-button";
  return (
    <>
      <Button
        id={id}
        className="mt-2"
        onClick={onSaveModel}
        hotkey={!inputFieldFocused ? "s" : undefined}
        hotkeyCtrl={!inputFieldFocused ? true : undefined}
      >
        <label>Save Model</label>
        <Tooltip anchorSelect={"#" + id} place="top">
          Save Model (Ctrl + S)
        </Tooltip>
      </Button>
    </>
  );
};

export default SaveModel;
