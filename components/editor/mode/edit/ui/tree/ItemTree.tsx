"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React, { useMemo } from "react";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import GroupedItem from "./GroupedItem";
import TreeElementList from "./TreeElementList";

type Props = {
  dictionary: Dictionary;
};

const ItemTree = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const groupedItems = useMemo(() => {
    const itemGroups: GroupedItem[] = [];
    const processGroup = (items: Item[], groupLevel: number) => {
      let localIndex = 0;
      items.forEach((item) => {
        itemGroups.push({
          item: item,
          groupLevel: groupLevel,
          localIndex: localIndex,
        });
        localIndex += 1;
        if (item.type == ItemType.Group) {
          processGroup(item.items, groupLevel + 1);
        }
      });
    };
    processGroup(modelData.items, 0);
    return itemGroups;
  }, [modelData]);

  const gridfinityId = useMemo(() => {
    const item = modelData.items.find((it) => it.type == ItemType.Gridfinity);
    if (item) {
      return item.id;
    }
  }, [modelData]);

  const onDragEnd = (result: DropResult) => {
    if (result.destination?.index == 0 || result.source.index == 0) {
      return;
    }
    if (result.combine) {
      if (result.combine.draggableId == gridfinityId) {
        return;
      }

      const { getById, findParentId } = forModelData(modelData);
      const combineItem = getById(result.combine.draggableId);
      if (combineItem && combineItem.type == ItemType.Group) {
        const item = getById(result.draggableId);
        if (item) {
          const updatedData = forModelData(modelData)
            .useChaining()
            .removeById(result.draggableId)
            .updateItem({
              ...combineItem,
              items: [...combineItem.items, item],
            });
          setModelData(updatedData, EditorHistoryType.OBJ_REORDER);
        } else {
          throw new Error("Item not found with id: " + result.draggableId);
        }
      } else {
        const parentId = findParentId(combineItem.id);
        const item = getById(result.draggableId);
        const group = itemGroupOf([item, combineItem]);
        const updatedData = forModelData(modelData)
          .useChaining()
          .removeById(item.id)
          .removeById(combineItem.id)
          .addItem(group, parentId)
          .getData();

        setModelData(updatedData, EditorHistoryType.GROUP_ADDED);
      }

      return;
    }

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    // Handle basic drag
    const item = forModelData(modelData).getById(result.draggableId);
    const destinationGroup = groupedItems[result.destination.index];
    if (destinationGroup.groupLevel > 0) {
      const parentId = forModelData(modelData).findParentId(
        destinationGroup.item.id
      );
      if (parentId) {
        const updatedData = forModelData(modelData)
          .useChaining()
          .removeById(item.id)
          .addItem(item, parentId)
          .reorderData(
            modelData.items.length - 1, // TODO Should get the last index inside the function
            destinationGroup.localIndex,
            parentId
          )
          .getData();
        setModelData(updatedData, EditorHistoryType.OBJ_REORDER);
      }
    } else {
      const updatedData = forModelData(modelData)
        .useChaining()
        .removeById(item.id)
        .addItem(item)
        .reorderData(modelData.items.length - 1, destinationGroup.localIndex)
        .getData();
      setModelData(updatedData, EditorHistoryType.OBJ_REORDER);
    }
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
