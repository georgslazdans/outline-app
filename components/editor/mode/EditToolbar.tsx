"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useCallback, useState } from "react";
import ImportDialog from "../svg/ImportDialog";
import { ContourPoints } from "@/lib/Point";
import { Item, Shadow, shadowItemOf } from "@/lib/replicad/Model";
import { ModelData } from "@/lib/replicad/Work";
import GridfinityEdit from "./params/GridfinityEdit";
import GridfinityParams from "@/lib/replicad/GridfinityParams";
import ShadowEdit from "./params/ShadowEdit";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataUpdate: (modelData: ModelData) => void;
  selectedId?: string;
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
}: Props) => {
  const [openImportDialog, setOpenImportDialog] = useState(false);

  const onContourSelect = (points: ContourPoints[], height: number) => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const shadow = shadowItemOf(points, height, gridfinityHeight - height);
    onModelDataUpdate({ items: [...modelData.items, shadow] });
  };

  const onGridfinityParamsChange = useCallback(
    (id: string, params: GridfinityParams) => {
      const updatedItems = modelData.items.map((item) => {
        if (item.id === id) {
          return { ...item, params };
        }
        return item;
      });

      onModelDataUpdate({ ...modelData, items: updatedItems });
    },
    [modelData, onModelDataUpdate]
  );

  const onShadowParamsChange = useCallback(
    (id: string, params: Item & Shadow) => {
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
                params={item}
                onParamsChange={(params) =>
                  onShadowParamsChange(item.id, params)
                }
              ></ShadowEdit>
            </>
          );
        case "primitive":
          break;
      }
    },
    [dictionary, onGridfinityParamsChange, onShadowParamsChange]
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

  return (
    <>
      <Button onClick={() => setOpenImportDialog(true)}>
        <label>Add Contour</label>
      </Button>
      <ImportDialog
        dictionary={dictionary}
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onContourSelect={onContourSelect}
      ></ImportDialog>
      {selectedId && (
        <Button onClick={onRemoveContour} className="mt-2">
          <label>Remove Contour</label>
        </Button>
      )}
      {propertiesFor(selectedId)}
    </>
  );
};

export default EditToolbar;
