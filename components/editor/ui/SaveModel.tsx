"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { RefObject } from "react";
import Button from "../../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { useModelContext } from "../ModelContext";
import { useLoading } from "@/context/LoadingContext";
import { useEditorContext } from "../EditorContext";
import { Tooltip } from "react-tooltip";
import Model from "@/lib/Model";
import { useErrorModal } from "@/components/error/ErrorContext";
import { scaleImage } from "@/lib/utils/ImageData";

type Props = {
  dictionary: Dictionary;
  canvasRef: RefObject<HTMLCanvasElement>;
};

const SaveModel = ({ dictionary, canvasRef }: Props) => {
  const { add, update } = useIndexedDB("models");
  const { add: addImageBlob, deleteRecord: deleteImageBlob } =
    useIndexedDB("files");

  const { withHotkey } = useEditorContext();
  const { model, setModel } = useModelContext();
  const { setLoading } = useLoading();
  const { showError } = useErrorModal();

  const saveModel = (newModel: Model) => {
    if (newModel.id) {
      update(newModel).then(
        () => {
          console.log("Model saved!", newModel.id);
        },
        (error) => {
          showError(error);
        }
      );
    } else {
      add(newModel).then(
        (dbId) => {
          setModel({ ...newModel, id: dbId });
          console.log("Model saved!", newModel.id);
        },
        (error) => {
          showError(error);
        }
      );
    }
  };

  const onSaveModel = () => {
    setLoading(true);

    canvasRef.current!.toBlob((blob) => {
      if (blob) {
        scaleImage(blob).then((scaledBlob) => {
          addImageBlob({ blob: scaledBlob }).then((imageFileId) => {
            if (model.imageFile) {
              deleteImageBlob(model.imageFile).then(() => {});
            }
            saveModel({
              ...model,
              imageFile: imageFileId,
            });
            setLoading(false);
          });
        });
      } else {
        saveModel(model);
        setLoading(false);
      }
    }, "image/png");
  };

  const id = "save-model-button";
  return (
    <>
      <Button
        id={id}
        className="mt-2"
        onClick={onSaveModel}
        {...withHotkey("s", true)}
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
