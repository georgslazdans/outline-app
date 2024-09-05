"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useMemo, useState } from "react";
import { useEditorContext } from "../../EditorContext";
import ItemTree from "./ui/tree/ItemTree";
import ParamsEdit from "./params/ParamsEdit";
import ActionButtons from "../../ui/action/ActionButtons";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import AddButtonGroup from "./ui/action/add/AddButtonGroup";
import EditContourGroup from "./ui/action/contour/EditContourGroup";
import EditActionMenu, { editActionMenuOptionsFor } from "./ui/EditActionMenu";
import ActionMenu from "../../ui/action/ActionMenu";

type Props = {
  dictionary: Dictionary;
};

const EditToolbar = ({ dictionary }: Props) => {
  const { modelData } = useModelDataContext();

  const { selectedId } = useEditorContext();
  const [currentMenu, setCurrentMenu] = useState<EditActionMenu>(
    EditActionMenu.ACTIONS
  );

  const selectedItem = useMemo(() => {
    if (selectedId) {
      return forModelData(modelData).findById(selectedId);
    }
  }, [modelData, selectedId]);

  return (
    <>
      <div className="xl:hidden">
        <ActionMenu
          options={editActionMenuOptionsFor(dictionary)}
          onChange={setCurrentMenu}
          selected={currentMenu}
        ></ActionMenu>
      </div>

      {/* Mobile */}
      <div className="xl:hidden overflow-auto">
        {currentMenu == EditActionMenu.ITEMS && (
          <ItemTree dictionary={dictionary}></ItemTree>
        )}

        {currentMenu == EditActionMenu.ACTIONS && (
          <ActionButtons dictionary={dictionary}>
            <AddButtonGroup
              dictionary={dictionary}
              selectedItem={selectedItem}
            ></AddButtonGroup>

            <EditContourGroup
              dictionary={dictionary}
              selectedItem={selectedItem}
            ></EditContourGroup>
          </ActionButtons>
        )}

        {currentMenu == EditActionMenu.PROPERTIES && selectedItem && (
          <ParamsEdit dictionary={dictionary} item={selectedItem}></ParamsEdit>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden xl:block">
        <ItemTree dictionary={dictionary}></ItemTree>

        <ActionButtons dictionary={dictionary}>
          <AddButtonGroup
            dictionary={dictionary}
            selectedItem={selectedItem}
          ></AddButtonGroup>

          <EditContourGroup
            dictionary={dictionary}
            selectedItem={selectedItem}
          ></EditContourGroup>
        </ActionButtons>

        {selectedItem && (
          <ParamsEdit dictionary={dictionary} item={selectedItem}></ParamsEdit>
        )}
      </div>
    </>
  );
};

export default EditToolbar;
