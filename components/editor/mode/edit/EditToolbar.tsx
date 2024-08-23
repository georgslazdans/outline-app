"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useMemo, useState } from "react";
import ImportDialog from "./ui/ImportDialog";
import { ContourPoints } from "@/lib/Point";
import ModelData, { forModelData } from "@/lib/replicad/ModelData";
import PrimitiveType from "@/lib/replicad/PrimitiveType";
import { useEditorContext } from "../../EditorContext";
import EditorMode from "../EditorMode";
import EditorHistoryType from "../../history/EditorHistoryType";
import { UpdateModelData } from "../../EditorComponent";
import ItemTree from "./ui/tree/ItemTree";
import ParamsEdit from "./params/ParamsEdit";
import { shadowItemOf, primitiveOf } from "@/lib/replicad/Item";
import ModelType from "@/lib/replicad/ModelType";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const gridfinityHeightOf = (modelData: ModelData) => {
  const magicConstant = 42;
  const gridfinityHeight = modelData.items.find(
    (it) => it.type == ModelType.Gridfinity
  )!.params.height;
  return gridfinityHeight * magicConstant;
};

const EditToolbar = ({ dictionary, modelData, setModelData }: Props) => {
  const [openImportDialog, setOpenImportDialog] = useState(false);

  const {
    selectedId,
    setSelectedId,
    setEditorMode,
    inputFieldFocused,
    setInputFieldFocused,
  } = useEditorContext();

  const onContourSelect = (
    points: ContourPoints[],
    height: number,
    name: string
  ) => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const shadow = shadowItemOf(
      points,
      height,
      gridfinityHeight - height,
      name
    );
    setSelectedId(shadow.id);
    setModelData(
      { items: [...modelData.items, shadow] },
      EditorHistoryType.OBJ_ADDED,
      shadow.id
    );
  };

  const addPrimitive = () => {
    // TODO add into current group...
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const primitive = primitiveOf(PrimitiveType.BOX, gridfinityHeight);
    setSelectedId(primitive.id);
    setModelData(
      { items: [...modelData.items, primitive] },
      EditorHistoryType.OBJ_ADDED,
      primitive.id
    );
  };

  const selectedItem = useMemo(() => {
    if (selectedId) {
      return forModelData(modelData).findById(selectedId);
    }
  }, [modelData, selectedId]);

  const onRemoveContour = () => {
    if (!selectedId) return;

    const updatedData = forModelData(modelData).removeById(selectedId);
    setSelectedId("");
    setModelData(updatedData, EditorHistoryType.OBJ_DELETED, selectedId);
  };

  const isGridfinity = (id: string) => {
    const item = forModelData(modelData).findById(id);
    return item?.type == "gridfinity";
  };
  const isShadow = (id: string) => {
    const item = forModelData(modelData).findById(id);
    return item?.type == "shadow";
  };

  const openContourDialog = () => {
    setInputFieldFocused(true);
    setOpenImportDialog(true);
  };

  return (
    <>
      <ItemTree
        dictionary={dictionary}
        modelData={modelData}
        setModelData={setModelData}
      ></ItemTree>
      <Button className="mb-2" onClick={() => addPrimitive()}>
        <label>Add Primitive</label>
      </Button>
      <Button onClick={openContourDialog}>
        <label>Add Contour</label>
      </Button>

      <ImportDialog
        dictionary={dictionary}
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onContourSelect={onContourSelect}
      ></ImportDialog>
      {selectedId && isShadow(selectedId) && (
        <Button
          onClick={() => setEditorMode(EditorMode.CONTOUR_EDIT)}
          className="mt-2"
        >
          <label>Edit Contour</label>
        </Button>
      )}
      {selectedId && !isGridfinity(selectedId) && (
        <Button
          onClick={onRemoveContour}
          hotkey={!inputFieldFocused ? "Delete" : ""}
          className="mt-2"
        >
          <label>Remove {isShadow(selectedId) ? "Contour" : "Primitive"}</label>
        </Button>
      )}
      {selectedItem && (
        <ParamsEdit
          dictionary={dictionary}
          item={selectedItem}
          modelData={modelData}
          setModelData={setModelData}
        ></ParamsEdit>
      )}
    </>
  );
};

export default EditToolbar;
