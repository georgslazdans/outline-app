"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useCallback } from "react";
import { downloadFile } from "@/lib/utils/Download";
import newWorkerInstance from "../../ReplicadWorker";
import { useModelDataContext } from "../../ModelDataContext";
import { Tooltip } from "react-tooltip";
import { useModelLoadingIndicatorContext } from "../../cache/ModelLoadingIndicatorContext";
import { useErrorModal } from "@/components/error/ErrorContext";

type Props = {
  dictionary: Dictionary;
};

const ResultToolbar = ({ dictionary }: Props) => {
  const { modelData } = useModelDataContext();
  const { setIsLoading } = useModelLoadingIndicatorContext();
  const { showError } = useErrorModal();

  const onStlDownload = useCallback(() => {
    const { api, worker } = newWorkerInstance();
    setIsLoading(true);
    api.downloadStl(modelData).then(
      (blob) => {
        downloadFile(blob as Blob, "export.stl");
        setIsLoading(false);
        worker.terminate();
      },
      (error) => {
        showError(error);
        setIsLoading(false);
      }
    );
  }, [modelData, setIsLoading, showError]);

  const onStepDownload = useCallback(() => {
    const { api, worker } = newWorkerInstance();
    setIsLoading(true);
    api.downloadStep(modelData).then(
      (blob) => {
        downloadFile(blob as Blob, "export.step");
        setIsLoading(false);
        worker.terminate();
      },
      (error) => {
        showError(error);
        setIsLoading(false);
      }
    );
  }, [modelData, setIsLoading, showError]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Button id="download-stl-model" onClick={() => onStlDownload()}>
          <label>Download STL</label>
          <Tooltip anchorSelect={"#download-stl-model"} place="top">
            Download STL Model
          </Tooltip>
        </Button>
        <Button id="download-step-model" onClick={() => onStepDownload()}>
          <label>Download STEP</label>
          <Tooltip anchorSelect={"#download-step-model"} place="top">
            Download STEP Model
          </Tooltip>
        </Button>
      </div>
    </>
  );
};

export default ResultToolbar;
