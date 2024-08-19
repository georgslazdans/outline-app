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
import { ModelData } from "@/lib/replicad/Work";
import GridfinityEdit from "./params/GridfinityEdit";
import GridfinityParams from "@/lib/replicad/GridfinityParams";
import ShadowEdit from "./params/ShadowEdit";
import PrimitiveEdit from "./params/primtive/PrimitiveEdit";
import PrimitiveType from "@/lib/replicad/PrimitiveType";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataUpdate: (modelData: ModelData) => void;
  selectedId?: string;
  onModelIdSelect: (id: string) => void;
  onEditContour: () => void;
};

const gridfinityHeightOf = (modelData: ModelData) => {
  const magicConstant = 42;
  const gridfinityHeight = modelData.items.find(
    (it) => it.type == "gridfinity"
  )!.params.height;
  return gridfinityHeight * magicConstant;
};

const EditToolbar = ({
  dictionary,
  modelData,
  onModelDataUpdate,
  selectedId,
  onModelIdSelect,
  onEditContour,
}: Props) => {
  const [openImportDialog, setOpenImportDialog] = useState(false);

  const onContourSelect = (points: ContourPoints[], height: number) => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const shadow = shadowItemOf(points, height, gridfinityHeight - height);
    onModelDataUpdate({ items: [...modelData.items, shadow] });
    onModelIdSelect(shadow.id);
  };


  const addPrimitive = () => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const primitive = primitiveOf(PrimitiveType.SPHERE, gridfinityHeight);
    onModelDataUpdate({ items: [...modelData.items, primitive] });
    onModelIdSelect(primitive.id);
  };

  const onGridfinityParamsChange = useCallback(
    (id: string, params: GridfinityParams) => {
      const updatedItems = modelData.items.map((item) => {
        if (item.id === id && item.type == "gridfinity") {
          return { ...item, params };
        }
        return item;
      });

      onModelDataUpdate({ ...modelData, items: updatedItems });
    },
    [modelData, onModelDataUpdate]
  );

  const onItemChanged = useCallback(
    (id: string, params: Item) => {
      const updatedItems = modelData.items.map((item) => {
        if (item.id === id) {
          return params;
        }
        return item;
      });

      onModelDataUpdate({ ...modelData, items: updatedItems });
    },
    [modelData, onModelDataUpdate]
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
                onParamsChange={(params) => onItemChanged(item.id, params)}
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
    onModelDataUpdate({ ...modelData, items: updatedItems });
  };

  const isGridfinity = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "gridfinity";
  };

  const isShadow = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "shadow";
  };


  return (
    <>
      <Button className="mb-2" onClick={() => addPrimitive()}>
        <label>Add Primitive</label>
      </Button>
      <Button onClick={() => setOpenImportDialog(true)}>
        <label>Add Contour</label>
      </Button>

      <ImportDialog
        dictionary={dictionary}
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onContourSelect={onContourSelect}
      ></ImportDialog>
      {selectedId && isShadow(selectedId) && (
        <Button onClick={onEditContour} className="mt-2">
          <label>Edit Contour</label>
        </Button>
      )}
      {selectedId && !isGridfinity(selectedId) && (
        <Button onClick={onRemoveContour} className="mt-2">
          <label>Remove {isShadow(selectedId) ? "Contour" : "Primitive"}</label>
        </Button>
      )}
      {propertiesFor(selectedId)}
    </>
  );
};

export default EditToolbar;
