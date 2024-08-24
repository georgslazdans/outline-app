"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useMemo } from "react";
import { useEditorContext } from "../../EditorContext";
import ItemTree from "./ui/tree/ItemTree";
import ParamsEdit from "./params/ParamsEdit";
import ActionButtons from "./ui/action/ActionButtons";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/queries/ForModelData";

type Props = {
  dictionary: Dictionary;
};

const EditToolbar = ({ dictionary }: Props) => {
  const {modelData} = useModelDataContext();

  const { selectedId } = useEditorContext();

  const selectedItem = useMemo(() => {
    if (selectedId) {
      return forModelData(modelData).findById(selectedId);
    }
  }, [modelData, selectedId]);

  return (
    <>
      <ItemTree
        dictionary={dictionary}
      ></ItemTree>

      <ActionButtons
        dictionary={dictionary}
        selectedItem={selectedItem}
      ></ActionButtons>

      {selectedItem && (
        <ParamsEdit
          dictionary={dictionary}
          item={selectedItem}
        ></ParamsEdit>
      )}
    </>
  );
};

export default EditToolbar;
