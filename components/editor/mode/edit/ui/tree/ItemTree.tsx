"use client";

import { Dictionary } from "@/app/dictionaries";
import { forModelData } from "@/lib/replicad/model/ModelData";
import React, { useMemo } from "react";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableItem from "./DraggableItem";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import { useModelDataContext } from "@/components/editor/ModelDataContext";

type ItemGroup = {
  item: Item;
  groupLevel: number;
  localIndex: number;
};

type Props = {
  dictionary: Dictionary;
};

const ItemTree = ({ dictionary }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onItemChanged = (item: Item) => {
    const updatedData = forModelData(modelData).updateById(item.id, item);
    setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, item.id);
  };

  const groupedItems = useMemo(() => {
    const itemGroups: ItemGroup[] = [];
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

  const onDragEnd = (result: DropResult) => {
    if (result.destination?.index == 0 || result.source.index == 0) {
      return;
    }
    if (result.combine) {
      const combineItem = forModelData(modelData).getById(
        result.combine.draggableId
      );
      if (combineItem && combineItem.type == ItemType.Group) {
        const item = forModelData(modelData).getById(result.draggableId);
        if (item) {
          let updatedData = forModelData(modelData).removeById(
            result.draggableId
          );
          updatedData = forModelData(updatedData).updateById(combineItem.id, {
            ...combineItem,
            items: [...combineItem.items, item],
          });
          setModelData(updatedData, EditorHistoryType.OBJ_REORDER);
        } else {
          throw new Error("Item not found with id: " + result.draggableId);
        }
      } else {
        const parentId = forModelData(modelData).findParentId(combineItem.id);
        const item = forModelData(modelData).getById(result.draggableId);
        let updatedData = forModelData(modelData).removeById(item.id);
        updatedData = forModelData(updatedData).removeById(combineItem.id);
        const group = itemGroupOf([item, combineItem]);
        updatedData = forModelData(updatedData).addItem(group, parentId);
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

    const item = forModelData(modelData).getById(result.draggableId);
    const destinationGroup = groupedItems[result.destination.index];
    if (destinationGroup.groupLevel > 0) {
      const parentId = forModelData(modelData).findParentId(
        destinationGroup.item.id
      );
      if (parentId) {
        let updatedData = forModelData(modelData).removeById(item.id);
        updatedData = forModelData(updatedData).addItem(item, parentId);
        updatedData = forModelData(updatedData).reorderData(
          updatedData.items.length - 1,
          destinationGroup.localIndex,
          parentId
        );
        setModelData(updatedData, EditorHistoryType.OBJ_REORDER);
      }
    } else {
      let updatedData = forModelData(modelData).removeById(item.id);
      updatedData = forModelData(updatedData).addItem(item);
      updatedData = forModelData(updatedData).reorderData(
        updatedData.items.length - 1,
        destinationGroup.localIndex
      );
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
                {groupedItems.map(({ item, groupLevel }, index) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    index={index}
                    dictionary={dictionary}
                    onItemChanged={onItemChanged}
                    groupLevel={groupLevel}
                  ></DraggableItem>
                ))}
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
