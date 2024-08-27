"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useState } from "react";
import SvgSelect from "./SvgSelect";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useEditorContext } from "../../../EditorContext";
import NumberField from "@/components/fields/NumberField";
import ContourPoints from "@/lib/data/point/ContourPoints";

type Props = {
  dictionary: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  onContourSelect: (
    contours: ContourPoints[],
    height: number,
    name: string
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
  const [name, setName] = useState("");

  const onImport = useCallback(() => {
    if (selectedContour) {
      onContourSelect(selectedContour, shadowHeight, name);
      onModalClose();
    }
  }, [selectedContour, shadowHeight, name]);

  const onModalClose = () => {
    setSelectedContour(undefined);
    setInputFieldFocused(false);
    onClose();
  };

  const onHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShadowHeight(parseFloat(event.target.value));
  };

  const onContourNameSelect = useCallback(
    (contourPoints: ContourPoints[], name: string) => {
      setSelectedContour(contourPoints);
      setName(name);
    },
    [setSelectedContour, setName]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <SvgSelect
          dictionary={dictionary}
          onSelect={onContourNameSelect}
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
