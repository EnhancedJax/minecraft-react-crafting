import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApp } from "../../provider";
import { EMPTY_ITEM } from "./constants";

const InventoryContext = createContext();
const useInventory = () => useContext(InventoryContext);

const InventoryProvider = ({
  type,
  children,
  pickUpCallback = () => {},
  allowRightClickPickup = true,
  canPutDown = () => true,
}) => {
  const {
    items,
    insertInventoryItem,
    heldItem,
    setHeldItem,
    setMousePosition,
    setIsLeftDragging,
    clickReference,
    setInventory,
    setClickReference,
    handleMouseLeave,
    inventories,
  } = useApp();

  const inventory = inventories[type];
  const [lastMouseDownSlotIndex, setLastMouseDownSlotIndex] =
    useState(undefined);
  const [checkDClickIndex, setCheckDClickIndex] = useState(undefined);
  const [isLastRightClick, setIsLastRightClick] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSlots, setDraggedSlots] = useState([]);
  const [dragRemainder, setDragRemainder] = useState(-1);
  const [dragStash, setDragStash] = useState([]);

  const timeoutDClick = useCallback(() => {
    setTimeout(() => setCheckDClickIndex(undefined), 250);
  }, []);

  const placeOneItem = useCallback(
    (newInventory, newHeldItem, index) => {
      if (newInventory[index].id === null) {
        newInventory[index] = { id: newHeldItem.id, count: 1 };
        newHeldItem =
          newHeldItem.count > 1
            ? { ...newHeldItem, count: newHeldItem.count - 1 }
            : EMPTY_ITEM;
      } else if (newInventory[index].id === newHeldItem.id) {
        const totalCount = newInventory[index].count + 1;
        if (totalCount <= items[newHeldItem.id].stackSize) {
          newInventory[index] = { id: newHeldItem.id, count: totalCount };
          newHeldItem =
            newHeldItem.count > 1
              ? { ...newHeldItem, count: newHeldItem.count - 1 }
              : EMPTY_ITEM;
        }
      }
      return [newInventory, newHeldItem];
    },
    [items]
  );

  const handleDrag = useCallback(
    (index, syncLastRightClick) => {
      if (heldItem.id === null) return;
      const draggedItem = inventory[index];
      if (!canPutDown(heldItem, draggedItem)) return;
      const isRightClick = isLastRightClick || syncLastRightClick;
      const isEmptyOrSame = ![null, heldItem.id].includes(draggedItem.id);
      if ((isRightClick && isEmptyOrSame) || draggedSlots.includes(index))
        return;
      if (!isRightClick && isEmptyOrSame) return;

      let newDraggedSlots = [...draggedSlots, index];
      let newInventory = [...inventory];
      let newHeldItem = { ...heldItem };

      if (isRightClick) {
        [newInventory, newHeldItem] = placeOneItem(
          newInventory,
          newHeldItem,
          index
        );
      } else {
        let newDragStash = [...dragStash];
        newDragStash.push(
          draggedItem.id === heldItem.id ? draggedItem.count : null
        );
        const distributedCount = Math.floor(
          newHeldItem.count / newDraggedSlots.length
        );
        if (distributedCount < 1) return;
        setDragRemainder(newHeldItem.count % newDraggedSlots.length);
        newDraggedSlots.forEach((slot, index) => {
          if (newDragStash[index] !== null) {
            newInventory[slot].count = distributedCount + newDragStash[index];
          } else {
            newInventory[slot] = {
              id: newHeldItem.id,
              count: distributedCount,
            };
          }
        });
        setDragStash(newDragStash);
      }
      setInventory(type, newInventory);
      setHeldItem(newHeldItem);
      setDraggedSlots(newDraggedSlots);
    },
    [
      inventory,
      heldItem,
      isLastRightClick,
      draggedSlots,
      canPutDown,
      placeOneItem,
      setInventory,
      setHeldItem,
      type,
    ]
  );

  const handleFinishDrag = useCallback(() => {
    setDraggedSlots([]);
    if (dragRemainder >= 0) {
      setHeldItem(
        dragRemainder === 0 ? EMPTY_ITEM : { ...heldItem, count: dragRemainder }
      );
    }
    setDragRemainder(-1);
    setDragStash([]);
  }, [dragRemainder, heldItem, setHeldItem]);

  const handleSlotClick = useCallback(
    (index, isRightClick = false, isShift = false) => {
      let newInventory = [...inventory];
      let newHeldItem = { ...heldItem };
      const clickedItem = { ...newInventory[index] };

      if (isShift) {
        if (clickedItem.id === null) return;
        insertInventoryItem(
          [clickedItem],
          type === "hotbar" ? "inventory" : "hotbar"
        );
        newInventory[index] = EMPTY_ITEM;
        pickUpCallback();
      } else if (newHeldItem.id !== null) {
        if (!canPutDown(newHeldItem, clickedItem)) {
          if (newHeldItem.id === clickedItem.id) {
            const totalCount = clickedItem.count + heldItem.count;
            const stackSize = items[newHeldItem.id].stackSize;
            if (totalCount <= stackSize) {
              newHeldItem.count = totalCount;
              newInventory[index] = EMPTY_ITEM;
              pickUpCallback();
            }
          }
        } else {
          const stackSize = items[newHeldItem.id].stackSize;
          if (!isRightClick) {
            if (checkDClickIndex !== index) {
              if (clickedItem.id === newHeldItem.id) {
                const totalCount = clickedItem.count + heldItem.count;
                if (totalCount <= stackSize) {
                  newInventory[index] = {
                    id: newHeldItem.id,
                    count: totalCount,
                  };
                  newHeldItem = EMPTY_ITEM;
                } else {
                  newInventory[index] = {
                    id: newHeldItem.id,
                    count: stackSize,
                  };
                  newHeldItem.count = totalCount - stackSize;
                }
              } else {
                [newInventory[index], newHeldItem] = [
                  heldItem,
                  clickedItem.id !== null ? clickedItem : EMPTY_ITEM,
                ];
              }
            } else {
              for (let i = 0; i < newInventory.length; i++) {
                if (newInventory[i].id === newHeldItem.id) {
                  if (newInventory[i].count + newHeldItem.count > stackSize) {
                    newInventory[i].count -= stackSize - newHeldItem.count;
                    newHeldItem.count = stackSize;
                    break;
                  }
                  newHeldItem.count += newInventory[i].count;
                  newInventory[i] = EMPTY_ITEM;
                }
              }
              setCheckDClickIndex(undefined);
            }
          } else {
            [newInventory, newHeldItem] = placeOneItem(
              newInventory,
              newHeldItem,
              index
            );
          }
        }
      } else {
        pickUpCallback();
        if (isRightClick && clickedItem.id !== null && allowRightClickPickup) {
          const halfStack = Math.ceil(clickedItem.count / 2);
          newHeldItem = { id: clickedItem.id, count: halfStack };
          newInventory[index].count -= halfStack;
          if (newInventory[index].count === 0) {
            newInventory[index] = EMPTY_ITEM;
          }
        } else {
          newHeldItem = clickedItem.id !== null ? clickedItem : EMPTY_ITEM;
          newInventory[index] = EMPTY_ITEM;
        }
      }
      setCheckDClickIndex(index);
      timeoutDClick();
      setInventory(type, newInventory);
      setHeldItem(newHeldItem);
      handleMouseLeave();
    },
    [
      inventory,
      heldItem,
      checkDClickIndex,
      items,
      canPutDown,
      allowRightClickPickup,
      insertInventoryItem,
      pickUpCallback,
      placeOneItem,
      setInventory,
      setHeldItem,
      timeoutDClick,
      type,
      handleMouseLeave,
    ]
  );

  const handleMouseOver = useCallback(
    (index) => {
      if (isDragging) handleDrag(index);
    },
    [isDragging, handleDrag]
  );

  const handleMouseDown = useCallback(
    (e, index) => {
      if (!isDragging && !e.shiftKey) {
        const isRightClick = e.button === 2;
        setMousePosition({ x: e.clientX, y: e.clientY });
        setIsLastRightClick(isRightClick);
        setIsDragging(true);
        if (checkDClickIndex !== index) {
          handleDrag(index, isRightClick);
        }
      }
      setLastMouseDownSlotIndex(index);
      setClickReference(type);
    },
    [
      isDragging,
      checkDClickIndex,
      handleDrag,
      setMousePosition,
      setIsLastRightClick,
      setClickReference,
      type,
    ]
  );

  const handleMouseUp = useCallback(
    (e, index) => {
      if (clickReference !== type) return;
      if (
        index === null &&
        (e.target.classList[0] !== "mc-grid" ||
          e.target.classList[1] !== `type-${type}`)
      ) {
        if (isDragging) handleFinishDrag();
        setIsDragging(false);
        return;
      }

      setIsDragging(false);
      if (lastMouseDownSlotIndex === index && draggedSlots.length === 0) {
        handleSlotClick(index, isLastRightClick, e.shiftKey);
      }
      if (index !== null) {
        handleFinishDrag();
      } else {
        setDraggedSlots([]);
      }
      setIsLastRightClick(null);
    },
    [
      clickReference,
      type,
      isDragging,
      lastMouseDownSlotIndex,
      draggedSlots,
      isLastRightClick,
      handleFinishDrag,
      handleSlotClick,
    ]
  );

  useEffect(() => {
    const eventHandler = (e) => handleMouseUp(e, null);
    window.addEventListener("mouseup", eventHandler);
    return () => window.removeEventListener("mouseup", eventHandler);
  }, [handleMouseUp]);

  useEffect(() => {
    setIsLeftDragging(isDragging && !isLastRightClick);
  }, [isDragging, isLastRightClick, setIsLeftDragging]);

  const contextValue = {
    type,
    inventory,
    heldItem,
    draggedSlots,
    isLastRightClick,
    isDragging,
    handleMouseOver,
    handleMouseDown,
    handleMouseUp,
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryProvider, useInventory };
