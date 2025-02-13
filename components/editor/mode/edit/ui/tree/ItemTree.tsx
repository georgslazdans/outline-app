"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React, { useMemo } from "react";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import ItemGroup from "@/lib/replicad/model/item/ItemGroup";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import GroupedItem from "./GroupedItem";
import TreeElementList from "./TreeElementList";
import ModelData from "@/lib/replicad/model/ModelData";
import Gridfinity from "@/lib/replicad/model/item/gridfinity/Gridfinity";

type Props = {
  dictionary: Dictionary;
};

const ItemTree = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const groupedItems = useMemo(() => {
    const result: GroupedItem[] = [];
    const processGroup = (items: Item[], groupLevel: number) => {
      let localIndex = 0;
      items.forEach((item) => {
        result.push({
          item: item,
          groupLevel: groupLevel,
          localIndex: localIndex,
        });
        localIndex += 1;
        if (item.type == ItemType.Gridfinity) {
          processGroup(item.modifications, groupLevel + 1);
        }
        if (item.type == ItemType.Group) {
          processGroup(item.items, groupLevel + 1);
        }
      });
    };
    processGroup(modelData.items, 0);
    return result;
  }, [modelData]);

  const gridfinityIds: string[] = useMemo(() => {
    const item = modelData.items.find(
      (it) => it.type == ItemType.Gridfinity
    ) as Item & Gridfinity;
    if (item) {
      const modificationIds = item.modifications.map((it) => it.id);
      return [item.id, ...modificationIds];
    } else {
      return [];
    }
  }, [modelData]);

  const onItemCombine = (sourceId: string, targetId: string) => {
    const { getById, moveToGroup, moveToNewGroup } = forModelData(modelData);
    const item = getById(sourceId);
    const targetItem = getById(targetId);
    if (targetItem.type == ItemType.Group) {
      setModelData(
        moveToGroup(item, targetItem),
        EditorHistoryType.OBJ_REORDER
      );
    } else {
      setModelData(
        moveToNewGroup(item, targetItem),
        EditorHistoryType.GROUP_ADDED
      );
    }
  };

  const onItemDragged = (source: GroupedItem, target: GroupedItem) => {
    const { getById, findParentId, doesItem } = forModelData(modelData);
    const { item: sourceItem } = source;
    const { item: targetItem } = target;

    if (
      sourceItem.type == ItemType.Gridfinity ||
      targetItem.type == ItemType.Gridfinity
    ) {
      return;
    }
    const parentId = findParentId(targetItem.id);

    let updatedData: ModelData;
    if (doesItem(sourceItem.id).haveSameParentsAs(targetItem.id)) {
      updatedData = forModelData(modelData).reorderItems(
        source.localIndex,
        target.localIndex,
        parentId
      );
    } else {
      if (parentId) {
        const group = getById(parentId) as Item & ItemGroup;
        const lastElementIndex = group.items.length;
        updatedData = forModelData(modelData)
          .useChaining()
          .moveToGroup(sourceItem, group)
          .reorderItems(lastElementIndex, target.localIndex, group.id)
          .getData();
      } else {
        const lastElementIndex = modelData.items.length;
        updatedData = forModelData(modelData)
          .useChaining()
          .moveToRoot(sourceItem)
          .reorderItems(lastElementIndex, target.localIndex)
          .getData();
      }
    }
    setModelData(updatedData, EditorHistoryType.OBJ_REORDER);
  };

  const isModifyingGridfinityItems = (result: DropResult) => {
    const gridfinityItemIndex = gridfinityIds.length - 1;
    const destinationIndex = result.destination?.index
      ? result.destination?.index
      : 0;
    return (
      destinationIndex <= gridfinityItemIndex ||
      result.source.index <= gridfinityItemIndex
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (isModifyingGridfinityItems(result)) {
      return;
    }
    if (result.combine) {
      if (gridfinityIds.includes(result.combine.draggableId)) {
        return;
      }
      onItemCombine(result.draggableId, result.combine.draggableId);
      return;
    }

    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    onItemDragged(
      groupedItems[result.source.index],
      groupedItems[result.destination.index]
    );
  };

  return (
    <>
      <div className="w-full border rounded h-[12.4rem] overflow-y-scroll">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="item-tree" isCombineEnabled={true}>
            {(provided, snapshot) => (
              <ul ref={provided.innerRef} className="">
                <TreeElementList
                  dictionary={dictionary}
                  groupedItems={groupedItems}
                ></TreeElementList>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default ItemTree;
