"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useCallback, useState } from "react";
import ImportDialog from "./ImportDialog";
import { ContourPoints } from "@/lib/Point";
import {
  Item,
  Primitive,
  primitiveOf,
  Shadow,
  shadowItemOf,
} from "@/lib/replicad/Model";
import ModelData from "@/lib/replicad/ModelData";
import GridfinityEdit from "./params/GridfinityEdit";
import GridfinityParams from "@/lib/replicad/GridfinityParams";
import ShadowEdit from "./params/ShadowEdit";
import PrimitiveEdit from "./params/primtive/PrimitiveEdit";
import PrimitiveType from "@/lib/replicad/PrimitiveType";
import { useEditorContext } from "../../EditorContext";
import EditorMode from "../EditorMode";
import EditorHistoryType from "../../history/EditorHistoryType";
import { UpdateModelData } from "../../EditorComponent";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const gridfinityHeightOf = (modelData: ModelData) => {
  const magicConstant = 42;
  const gridfinityHeight = modelData.items.find(
    (it) => it.type == "gridfinity"
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

  const onContourSelect = (points: ContourPoints[], height: number) => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const shadow = shadowItemOf(points, height, gridfinityHeight - height);
    setSelectedId(shadow.id);
    setModelData(
      { items: [...modelData.items, shadow] },
      EditorHistoryType.OBJ_ADDED,
      shadow.id
    );
  };

  const addPrimitive = () => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const primitive = primitiveOf(PrimitiveType.BOX, gridfinityHeight);
    setSelectedId(primitive.id);
    setModelData(
      { items: [...modelData.items, primitive] },
      EditorHistoryType.OBJ_ADDED,
      primitive.id
    );
  };

  const onGridfinityParamsChange = useCallback(
    (id: string, params: GridfinityParams) => {
      const updatedItems = modelData.items.map((item) => {
        if (item.id === id && item.type == "gridfinity") {
          return { ...item, params };
        }
        return item;
      });

      setModelData(
        { ...modelData, items: updatedItems },
        EditorHistoryType.OBJ_UPDATED,
        id
      );
    },
    [modelData, setModelData]
  );

  const onItemChanged = useCallback(
    (id: string, params: Item) => {
      const updatedItems = modelData.items.map((item) => {
        if (item.id === id) {
          return params;
        }
        return item;
      });

      setModelData(
        { ...modelData, items: updatedItems },
        EditorHistoryType.OBJ_UPDATED,
        id
      );
    },
    [modelData, setModelData]
  );

  const propertiesComponentFor = useCallback(
    (item: Item) => {
      switch (item.type) {
        case "gridfinity":
          return (
            <GridfinityEdit
              dictionary={dictionary}
              params={item.params}
              onParamsChange={(params) =>
                onGridfinityParamsChange(item.id, params)
              }
            ></GridfinityEdit>
          );
        case "shadow":
          return (
            <>
              <ShadowEdit
                dictionary={dictionary}
                item={item}
                onItemChange={(params) => onItemChanged(item.id, params)}
              ></ShadowEdit>
            </>
          );
        case "primitive":
          return (
            <>
              <PrimitiveEdit
                dictionary={dictionary}
                item={item}
                onItemChange={(params) => onItemChanged(item.id, params)}
              ></PrimitiveEdit>
            </>
          );
      }
    },
    [dictionary, onGridfinityParamsChange, onItemChanged]
  );

  const propertiesFor = useCallback(
    (id?: string) => {
      const item = modelData.items.find((it) => it.id == id);
      if (item) {
        return propertiesComponentFor(item);
      }
    },
    [modelData, propertiesComponentFor]
  );

  const onRemoveContour = () => {
    if (!selectedId) return;
    const updatedItems = modelData.items.filter(
      (item) => item.id !== selectedId
    );
    setSelectedId("");
    setModelData(
      { ...modelData, items: updatedItems },
      EditorHistoryType.OBJ_DELETED,
      selectedId
    );
  };

  const isGridfinity = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "gridfinity";
  };

  const isShadow = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "shadow";
  };

  const openContourDialog = () => {
    setInputFieldFocused(true);
    setOpenImportDialog(true);
  };

  return (
    <>
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
      {propertiesFor(selectedId)}
    </>
  );
};

export default EditToolbar;
