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

type Props = {
  dictionary: Dictionary;
};

const NON_DRAGGABLE_TYPES = [
  ItemType.Gridfinity,
  ItemType.GridfinitySplit,
  ItemType.ContourShell,
];

const isNotDraggable = (item: Item): boolean => {
  return NON_DRAGGABLE_TYPES.includes(item.type);
};

const nonDraggableIdsOf = (modelData: ModelData) => {
  const itemIdsWith = (type: ItemType) => {
    return forModelData(modelData)
      .findByType(type)
      .map((it) => it.id);
  };
  return [
    ...itemIdsWith(ItemType.Gridfinity),
    ...itemIdsWith(ItemType.GridfinitySplit),
    ...itemIdsWith(ItemType.ContourShell),
  ];
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
        if (item.type == ItemType.Gridfinity && item.modifications) {
          processGroup(item.modifications, groupLevel + 1);
        }
        if (item.type == ItemType.Contour && item.modifications) {
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

  const nonDraggableIds: string[] = useMemo(() => {
    return nonDraggableIdsOf(modelData);
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

    if (isNotDraggable(sourceItem) || isNotDraggable(targetItem)) {
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

  const isModifyingNonDraggableItems = (result: DropResult) => {
    const sourceIndex = result.source.index;
    const { item: sourceItem } = groupedItems[sourceIndex];

    if (isNotDraggable(sourceItem)) {
      return true;
    }
    if (result.destination) {
      const destinationIndex = result.destination?.index
        ? result.destination?.index
        : 0;
      const { item: destinationItem } = groupedItems[destinationIndex];
      return isNotDraggable(destinationItem);
    } else {
      return false;
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (isModifyingNonDraggableItems(result)) {
      return;
    }
    if (result.combine) {
      if (nonDraggableIds.includes(result.combine.draggableId)) {
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
