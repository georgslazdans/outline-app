"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useState } from "react";
import SvgSelect from "./SvgSelect";
import { ContourPoints } from "@/lib/Point";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NumberField from "@/components/fiields/NumberField";

type Props = {
  dictionary: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  onContourSelect: (contours: ContourPoints[], height: number) => void;
};

const ImportDialog = ({
  dictionary,
  isOpen,
  onClose,
  onContourSelect,
}: Props) => {
  const [selectedContour, setSelectedContour] = useState<ContourPoints[]>();
  const [shadowHeight, setShadowHeight] = useState(10);

  const onImport = () => {
    if (selectedContour) {
      onContourSelect(selectedContour, shadowHeight);
      setSelectedContour(undefined);
      onClose();
    }
  };

  const onModalClose = () => {
    setSelectedContour(undefined);
    onClose();
  };

  const onHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShadowHeight(parseFloat(event.target.value));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <SvgSelect
          dictionary={dictionary}
          onSelect={setSelectedContour}
        ></SvgSelect>
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
