"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useState } from "react";
import DetailsContextContourSelect from "./DetailsContextContourSelect";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useEditorContext } from "../../../EditorContext";
import NumberField from "@/components/fields/NumberField";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { Context } from "@/context/DetailsContext";

type Props = {
  dictionary: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  onContourSelect: (
    contours: ContourPoints[],
    height: number,
    name: string,
    detailsContextId: number
  ) => void;
};

const ImportDialog = ({
  dictionary,
  isOpen,
  onClose,
  onContourSelect,
}: Props) => {
  const { setInputFieldFocused } = useEditorContext();
  const [selectedContour, setSelectedContour] = useState<ContourPoints[]>();
  const [shadowHeight, setShadowHeight] = useState(10);
  const [detailsContext, setDetailsContext] = useState<Context>();

  const onModalClose = useCallback(() => {
    setSelectedContour(undefined);
    setInputFieldFocused(false);
    onClose();
  }, [onClose, setInputFieldFocused]);

  const onImport = useCallback(() => {
    if (selectedContour && detailsContext) {
      onContourSelect(
        selectedContour,
        shadowHeight,
        detailsContext.details.name,
        detailsContext.id!
      );
      onModalClose();
    }
  }, [
    selectedContour,
    detailsContext,
    onContourSelect,
    shadowHeight,
    onModalClose,
  ]);

  const onHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShadowHeight(parseFloat(event.target.value));
  };

  const onDetailsContextSelect = useCallback(
    (contourPoints: ContourPoints[], context: Context) => {
      setSelectedContour(contourPoints);
      setDetailsContext(context);
    },
    [setSelectedContour]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModalClose}>
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
          style={selectedContour ? "primary" : "disabled"}
        >
          <label>Import Contour</label>
        </Button>
      </Modal>
    </>
  );
};

export default ImportDialog;
