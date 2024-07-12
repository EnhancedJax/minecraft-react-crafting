import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApp } from "../../provider";
import { maxStackSize } from "../../utils";
import { EMPTY_ITEM } from "./constants";

// Create a new context
const InventoryContext = createContext();
const useInventory = () => useContext(InventoryContext);

// Create a provider component
const InventoryProvider = ({ type, children }) => {
  const appContext = useApp();
  const {
    insertInventoryItem,
    heldItem,
    setHeldItem,
    setMousePosition,
    setIsLeftDragging,
    clickReference,
    setClickReference,
  } = appContext;
  const inventory = appContext[`${type}Inventory`];
  const setInventory =
    appContext[`set${type[0].toUpperCase()}${type.slice(1)}Inventory`];
  const [lastMouseDownSlotIndex, setLastMouseDownSlotIndex] =
    useState(undefined);
  const [checkDClickIndex, setCheckDClickIndex] = useState(undefined);
  const [isLastRightClick, setIsLastRightClick] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSlots, setDraggedSlots] = useState([]);
  const [dragRemainder, setDragRemainder] = useState(-1);

  /* ------------- Helpers ------------ */

  const timeoutDClick = () => {
    setTimeout(() => {
      setCheckDClickIndex(undefined);
    }, 250);
  };

  const placeOneItem = (newInventory, newHeldItem, index) => {
    if (newInventory[index].id === null) {
      newInventory[index] = { id: newHeldItem.id, count: 1 };
      if (heldItem.count > 1) {
        newHeldItem.count = heldItem.count - 1;
      } else {
        newHeldItem = EMPTY_ITEM;
      }
    } else {
      if (newInventory[index].id === newHeldItem.id) {
        const totalCount = newInventory[index].count + 1;
        if (totalCount <= maxStackSize(newHeldItem.id)) {
          newInventory[index] = {
            id: newHeldItem.id,
            count: totalCount,
          };
          if (heldItem.count > 1) {
            newHeldItem.count = heldItem.count - 1;
          } else {
            newHeldItem = EMPTY_ITEM;
          }
        }
      }
    }
    return [newInventory, newHeldItem];
  };

  /* -------------- Logic ------------- */

  const handleDrag = (index, syncLastRightClick) => {
    console.debug("dragging over:", index);
    const isRightClick = isLastRightClick || syncLastRightClick;
    if (heldItem.id === null) return; // can't drag if there's no item held
    if (isRightClick) {
      if (
        ![null, heldItem.id].includes(inventory[index].id) ||
        draggedSlots.includes(index)
      )
        return; // can't drag over an occupied slot unless it's the same item
    } else {
      if (inventory[index].id !== null) return; // can't drag over an occupied slot
    }

    let newDraggedSlots = [...draggedSlots];
    let newInventory = [...inventory];
    let newHeldItem = { ...heldItem };

    newDraggedSlots.push(index);
    if (isRightClick) {
      [newInventory, newHeldItem] = placeOneItem(
        newInventory,
        newHeldItem,
        index
      );
      // console.debug(newHeldItem);
    } else {
      const distributedCount = Math.floor(
        newHeldItem.count / newDraggedSlots.length
      );
      if (distributedCount < 1) return;
      setDragRemainder(newHeldItem.count % newDraggedSlots.length);
      newDraggedSlots.forEach((slot) => {
        newInventory[slot] = { id: newHeldItem.id, count: distributedCount };
      });
    }
    setInventory(newInventory);
    setHeldItem(newHeldItem);
    setDraggedSlots(newDraggedSlots);
  };

  const handleFinishDrag = useCallback(
    (index) => {
      console.debug("drag finished at:", index);
      setDraggedSlots([]);
      if (dragRemainder >= 0) {
        let newHeldItem = { ...heldItem };
        if (dragRemainder === 0) {
          newHeldItem = EMPTY_ITEM;
        } else {
          newHeldItem.count = dragRemainder;
        }
        setHeldItem(newHeldItem);
      }
      setDragRemainder(-1);
    },
    [dragRemainder]
  );

  const handleSlotClick = (index, isRightClick = false, isShift = false) => {
    console.debug("Registering click on ", index, checkDClickIndex);

    let newCheckDClickIndex = index;
    let newInventory = [...inventory];
    let newHeldItem = { ...heldItem };

    if (isShift) {
      console.debug("shift click");
      insertInventoryItem(
        [newInventory[index]],
        type === "player" ? "chest" : "player"
      );
      newInventory[index] = EMPTY_ITEM;
    } else if (newHeldItem.id !== null) {
      const stackSize = maxStackSize(newHeldItem.id);
      /* ------ Put down interaction ------ */
      if (!isRightClick) {
        // left click
        if (checkDClickIndex !== index) {
          if (newInventory[index].id === newHeldItem.id) {
            const totalCount = newInventory[index].count + heldItem.count;
            if (totalCount <= stackSize) {
              newInventory[index] = { id: newHeldItem.id, count: totalCount };
              newHeldItem = EMPTY_ITEM;
            } else {
              newInventory[index] = {
                id: newHeldItem.id,
                count: stackSize,
              };
              newHeldItem.count = totalCount - stackSize;
            }
          } else {
            // Swap items
            const temp = newInventory[index];
            newInventory[index] = heldItem;
            newHeldItem = temp.id !== null ? temp : EMPTY_ITEM;
          }
        } else {
          // double clicking: gathera all items of the same type, until reaching a stack or there are no items of the same type left.
          console.debug("double click");
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
          newCheckDClickIndex = undefined;
        }
      } else {
        // right click: place one item
        [newInventory, newHeldItem] = placeOneItem(
          newInventory,
          newHeldItem,
          index
        );
      }
    } else {
      /* ------- Pick up interaction ------ */
      if (isRightClick && newInventory[index].id !== null) {
        const halfStack = Math.ceil(newInventory[index].count / 2);
        newHeldItem = { id: newInventory[index].id, count: halfStack };
        newInventory[index].count -= halfStack;
        if (newInventory[index].count === 0) {
          newInventory[index] = EMPTY_ITEM;
        }
      } else {
        newHeldItem =
          newInventory[index].id !== null ? newInventory[index] : EMPTY_ITEM;
        newInventory[index] = EMPTY_ITEM;
      }
    }
    setCheckDClickIndex(newCheckDClickIndex);
    timeoutDClick();
    setInventory(newInventory);
    setHeldItem(newHeldItem);
  };

  /* ------------ Handlers ------------ */

  const handleMouseOver = (index) => {
    if (isDragging) handleDrag(index);
  };

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
    [handleDrag, checkDClickIndex, isDragging]
  );

  const handleMouseUp = useCallback(
    (e, index) => {
      if (clickReference !== type) return;
      if (
        index === null &&
        (e.target.classList[0] !== "mc-grid" ||
          e.target.classList[1] !== `type-${type}`)
      ) {
        // handle mouse up outside of the inventory
        console.debug("mouse up outside");
        if (isDragging) handleFinishDrag(null);
        setIsDragging(false);
        return;
      }
      console.debug("mouse up", index);
      setIsDragging(false);
      if (lastMouseDownSlotIndex === index && draggedSlots.length === 0) {
        handleSlotClick(index, isLastRightClick, e.shiftKey);
      }
      if (index !== null) {
        handleFinishDrag(index);
      } else {
        setDraggedSlots([]);
      }
      setIsLastRightClick(null);
    },
    [
      isDragging,
      dragRemainder,
      lastMouseDownSlotIndex,
      handleSlotClick,
      clickReference,
    ]
  );

  /* ------------- effects ------------ */

  useEffect(() => {
    const eventHandler = (e) => {
      handleMouseUp(e, null);
    };

    window.addEventListener("mouseup", eventHandler);

    return () => {
      window.removeEventListener("mouseup", eventHandler);
    };
  }, [handleMouseUp]);

  useEffect(() => {
    setIsLeftDragging(isDragging ? (!isLastRightClick ? true : false) : false);
  }, [isDragging, isLastRightClick]);

  return (
    <InventoryContext.Provider
      value={{
        type,
        inventory,
        heldItem,
        draggedSlots,
        isLastRightClick,
        isDragging,
        handleMouseOver,
        handleMouseDown,
        handleMouseUp,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryProvider, useInventory };
