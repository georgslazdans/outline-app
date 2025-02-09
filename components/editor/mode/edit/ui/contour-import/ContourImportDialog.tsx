"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useState } from "react";
import DetailsContextContourSelect from "./DetailsContextContourSelect";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useEditorContext } from "../../../../EditorContext";
import NumberField from "@/components/fields/NumberField";
import { Context } from "@/context/DetailsContext";
import ContourPointPreview from "./ContourPointPreview";

type Props = {
  dictionary: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  onContourSelect: (
    detailsContext: Context,
    contourIndex: number,
    height: number
  ) => void;
};

const ContourImportDialog = ({
  dictionary,
  isOpen,
  onClose,
  onContourSelect,
}: Props) => {
  const { setInputFieldFocused } = useEditorContext();
  const [shadowHeight, setShadowHeight] = useState(10);
  const [detailsContext, setDetailsContext] = useState<Context>();
  const [contourIndex, setContourIndex] = useState<number>(0);

  const onModalClose = useCallback(() => {
    setContourIndex(0);
    setDetailsContext(undefined);
    setInputFieldFocused(false);
    onClose();
  }, [onClose, setInputFieldFocused]);

  const onImport = useCallback(() => {
    if (detailsContext) {
      onContourSelect(detailsContext, contourIndex, shadowHeight);
      onModalClose();
    }
  }, [
    detailsContext,
    onContourSelect,
    contourIndex,
    shadowHeight,
    onModalClose,
  ]);

  const onHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShadowHeight(parseFloat(event.target.value));
  };

  const onDetailsContextSelect = useCallback(
    (context: Context, contourIndex: number) => {
      setDetailsContext(context);
      setContourIndex(contourIndex);
    },
    []
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ContourPointPreview
          context={detailsContext}
          contourIndex={contourIndex}
        ></ContourPointPreview>
        <DetailsContextContourSelect
          dictionary={dictionary}
          onSelect={onDetailsContextSelect}
        ></DetailsContextContourSelect>
        <NumberField
          label={"Shadow Height"}
          name={"shadow-height"}
          value={shadowHeight}
          onChange={onHeightChange}
          numberRange={{ min: 0, max: 10000, step: 0.01 }}
        ></NumberField>
        <Button
          className="mt-4"
          onClick={onImport}
          style={detailsContext ? "primary" : "disabled"}
        >
          <label>Import Contour</label>
        </Button>
      </Modal>
    </>
  );
};

export default ContourImportDialog;
