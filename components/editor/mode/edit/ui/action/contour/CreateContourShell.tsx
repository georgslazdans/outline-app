"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import React from "react";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import { newShellModification } from "@/lib/replicad/model/item/contour/ShellModification";
import Item from "@/lib/replicad/model/Item";
import Contour from "@/lib/replicad/model/item/contour/Contour";

type Props = {
  dictionary: Dictionary;
  item: Item & Contour;
};

const icon = (
  <svg
    viewBox="-0.5 -0.8 7.5 6.5"
    version="1.1"
    id="svg1"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    strokeWidth="0.4"
    stroke="currentColor"
  >
    <path
      strokeDasharray="none"
      strokeWidth="0.6"
      d="M 5.15,0.6 C 4.89,0.6 4.65,0.75 4.45,1.02 4.27,1.27 4.33,1.23 4.11,1.68 H 1.65 C 1.52,1.58 1.38,1.54 1.24,1.54 0.78,1.54 0.41,2.08 0.41,2.74 0.41,3.4 0.78,3.92 1.24,3.92 1.45,3.92 1.64,3.81 1.79,3.61 h 2.3 c 0.05,0.23 0.14,0.44 0.27,0.61 0.4,0.57 1.05,0.57 1.45,0 C 5.97,3.92 6.08,3.53 6.06,3.12 H 5.08 V 3.1 L 5.14,2.2 H 5.28 6.08 C 6.11,1.75 6.01,1.34 5.79,1.02 5.6,0.75 5.35,0.6 5.15,0.6 Z"
    />
    <path
      strokeDasharray="none"
      d="M 5.0508545,0.70279948 C 4.7936781,0.70292329 4.5474534,0.84594624 4.365625,1.100708 4.1867423,1.352698 4.2454181,1.3224972 4.0400635,1.7394287 H 1.7492472 C 1.6326091,1.653235 1.5023333,1.6081791 1.370459,1.6081706 0.92250942,1.6081411 0.55963464,2.1170659 0.55965576,2.7445353 0.55963458,3.3720049 0.92250944,3.8804129 1.370459,3.8803833 1.5681931,3.8800416 1.7593287,3.7787329 1.9073771,3.5951294 h 2.201416 c 0.045938,0.2137581 0.1289289,0.4086368 0.241329,0.5668905 0.378654,0.5308129 0.9930722,0.5309336 1.3720092,5.167e-4 C 5.9190771,3.8866405 6.021866,3.505471 6.0042847,3.1160889 H 5.1252686 V 3.0980021 L 5.1686768,2.1910807 H 5.3066528 6.016687 C 6.0443012,1.7874478 5.9417761,1.3874685 5.7371175,1.100708 5.5551637,0.84577042 5.3082084,0.70273314 5.0508545,0.70279948 Z"
    />
  </svg>
);
const CreateContourShell = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId } = useEditorContext();

  const onCreateShell = () => {
    const { updateItem } = forModelData(modelData);
    const shellModification = newShellModification();
    const modifications = item.modifications ? item.modifications : [];
    const updatedItem = {
      ...item,
      modifications: [...modifications, shellModification],
    };
    setModelData(
      updateItem(updatedItem),
      EditorHistoryType.OBJ_UPDATED,
      item?.id
    );
    setSelectedId(shellModification.id);
  };

  return (
    <>
      <ActionButton
        dictionary={dictionary}
        id={"split-contour"}
        onClick={onCreateShell}
        icon={icon}
        label="Shell"
        tooltip="Create Shell"
      ></ActionButton>
    </>
  );
};

export default CreateContourShell;
