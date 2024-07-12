import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import getTextures from "../../utils/getTextures";
import { INVENTORY_COLS, INVENTORY_ROWS, MAX_STACK_SIZE } from "./constants";

// Create a new context
const InventoryContext = createContext();
const useInventory = () => useContext(InventoryContext);

// Create a provider component
const InventoryProvider = ({ index, children }) => {
  const EMPTY_ITEM = { id: null, count: 0 };
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState(
    Array(INVENTORY_ROWS * INVENTORY_COLS).fill(EMPTY_ITEM)
  );
  const [heldItem, setHeldItem] = useState(EMPTY_ITEM);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastMouseDownSlotIndex, setLastMouseDownSlotIndex] =
    useState(undefined);
  const [checkDClickIndex, setCheckDClickIndex] = useState(undefined);
  const [isLastRightClick, setIsLastRightClick] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSlots, setDraggedSlots] = useState(new Set());
  const [dragRemainder, setDragRemainder] = useState(-1);

  /* ------------- Helpers ------------ */

  const insertInventoryItem = (itemArray) => {
    let i = 0;
    setInventory((prev) => {
      const newInventory = [...prev];
      newInventory.forEach((slot, index) => {
        if (i >= itemArray.length) return;
        if (newInventory[index].id === null) {
          newInventory[index] = itemArray[i];
          i++;
        }
      });
      return newInventory;
    });
  };

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
        if (totalCount <= MAX_STACK_SIZE) {
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
    console.log(
      "dragging over:",
      index,
      heldItem,
      isLastRightClick || syncLastRightClick
    );
    if (heldItem.id === null) return;
    if (isLastRightClick || syncLastRightClick) {
      if (
        ![null, heldItem.id].includes(inventory[index].id) ||
        draggedSlots.has(index)
      )
        return; // can't drag over an occupied slot unless it's the same item
    } else {
      if (inventory[index].id !== null) return; // can't drag over an occupied slot
    }
    draggedSlots.add(index);
    let newInventory = [...inventory];
    let newHeldItem = { ...heldItem };
    if (isLastRightClick || syncLastRightClick) {
      [newInventory, newHeldItem] = placeOneItem(
        newInventory,
        newHeldItem,
        index
      );
      // console.log(newHeldItem);
    } else {
      const distributedCount = Math.floor(
        newHeldItem.count / draggedSlots.size
      );
      if (distributedCount < 1) return;
      setDragRemainder(newHeldItem.count % draggedSlots.size);
      draggedSlots.forEach((slot) => {
        newInventory[slot] = { id: newHeldItem.id, count: distributedCount };
      });
    }
    setInventory(newInventory);
    setHeldItem(newHeldItem);
  };

  const handleFinishDrag = useCallback(
    (index) => {
      console.log("drag finished at:", index);
      draggedSlots.clear();
      // console.log(dragRemainder);
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

  const handleSlotClick = (index, isRightClick = false) => {
    console.log("Registering click on ", index, checkDClickIndex);

    let newCheckDClickIndex = index;
    let newInventory = [...inventory];
    let newHeldItem = { ...heldItem };

    if (newHeldItem.id !== null) {
      /* ------ Put down interaction ------ */
      if (!isRightClick) {
        // left click
        if (checkDClickIndex !== index) {
          if (newInventory[index].id === newHeldItem.id) {
            const totalCount = newInventory[index].count + heldItem.count;
            if (totalCount <= MAX_STACK_SIZE) {
              newInventory[index] = { id: newHeldItem.id, count: totalCount };
              newHeldItem = EMPTY_ITEM;
            } else {
              newInventory[index] = {
                id: newHeldItem.id,
                count: MAX_STACK_SIZE,
              };
              newHeldItem.count = totalCount - MAX_STACK_SIZE;
            }
          } else {
            // Swap items
            const temp = newInventory[index];
            newInventory[index] = heldItem;
            newHeldItem = temp.id !== null ? temp : EMPTY_ITEM;
          }
        } else {
          // double clicking: gathera all items of the same type, until reaching a stack or there are no items of the same type left.
          console.log("double click");
          for (let i = 0; i < newInventory.length; i++) {
            if (newInventory[i].id === newHeldItem.id) {
              if (newInventory[i].count + newHeldItem.count > MAX_STACK_SIZE) {
                newInventory[i].count -= MAX_STACK_SIZE - newHeldItem.count;
                newHeldItem.count = MAX_STACK_SIZE;
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
      const isRightClick = e.button === 2;
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsLastRightClick(isRightClick);
      setIsDragging(true);
      if (checkDClickIndex === index) {
        handleSlotClick(index, isRightClick);
      } else {
        handleDrag(index, isRightClick);
      }
      setLastMouseDownSlotIndex(index);
    },
    [handleDrag, checkDClickIndex]
  );

  const handleMouseUp = useCallback(
    (e, index) => {
      if (index === null && e.target.id !== "slot") {
        // handle mouse up outside of the inventory
        console.log("mouse up outside");
        if (isDragging) handleFinishDrag(null);
        setIsDragging(false);
        return;
      }
      console.log("mouse up", index);
      setIsDragging(false);
      if (lastMouseDownSlotIndex === index && draggedSlots.size === 0) {
        handleSlotClick(index, isLastRightClick);
      }
      if (index !== null) {
        handleFinishDrag(index);
      } else {
        draggedSlots.clear();
      }
      setIsLastRightClick(null);
    },
    [isDragging, dragRemainder]
  );

  /* ------------- effects ------------ */

  useEffect(() => {
    const fetchTextures = async () => {
      const { items } = await getTextures();
      setItems(items);
    };

    fetchTextures();

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const eventHandler = (e) => {
      handleMouseUp(e, null);
    };

    window.addEventListener("mouseup", eventHandler);

    return () => {
      window.removeEventListener("mouseup", eventHandler);
    };
  }, [handleMouseUp]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        inventory,
        heldItem,
        mousePosition,
        draggedSlots,
        handleMouseOver,
        handleMouseDown,
        handleMouseUp,
        insertInventoryItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryProvider, useInventory };
