import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  EMPTY_INVENTORY,
  EMPTY_ITEM,
} from "./components/InventorySlots/constants";
import { INVENTORIES } from "./constants";
import { getTextures } from "./utils";

// Create a new context
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// Create a provider component
const AppProvider = ({ children }) => {
  const types = useMemo(() => Object.keys(INVENTORIES), []);
  const [screen, setScreen] = useState(0);
  const [inventories, setInventories] = useState(
    types.reduce((acc, type) => {
      const thisInventory = INVENTORIES[type];
      acc[type] = EMPTY_INVENTORY(thisInventory.rows, thisInventory.cols);
      if (thisInventory?.defaultInventory) {
        const defaultInventory = thisInventory.defaultInventory;
        acc[type] = [
          ...defaultInventory,
          ...acc[type].slice(
            0,
            thisInventory.rows * thisInventory.cols - defaultInventory.length
          ),
        ];
      }
      return acc;
    }, {})
  );
  const [items, setItems] = useState([]);
  const [heldItem, setHeldItem] = useState(EMPTY_ITEM);
  const [isLeftDragging, setIsLeftDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickReference, setClickReference] = useState(null);
  const [tooltip, setTooltip] = useState("");
  const [skin, setSkin] = useState("/Steve_64x64.png");
  const [lastHovered, setLastHovered] = useState({ type: null, id: null });

  function setInventory(type, callback) {
    setInventories((prev) => {
      const newInventories = { ...prev };
      newInventories[type] =
        typeof callback === "function" ? callback(prev[type]) : callback;
      return newInventories;
    });
  }

  useEffect(() => {
    (async () => {
      const { items } = await getTextures();
      setItems(items);
    })();

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [children]);

  const insertInventoryItem = useCallback(
    (itemArray, targetType) => {
      if (!itemArray || !targetType) return console.error("Missing arguments");
      let i = 0;
      if (!types.includes(targetType))
        return console.error("Invalid target type", targetType);
      setInventory(targetType, (prev) => {
        const newInventory = [...prev];
        newInventory.forEach((slot, index) => {
          if (i >= itemArray.length) return;
          if (slot.id === null) {
            newInventory[index] = itemArray[i];
            i++;
          } else {
            const stackSize = items[itemArray[i].id].stackSize;
            const spaceLeft = stackSize - slot.count;
            if (slot.id === itemArray[i].id) {
              if (spaceLeft >= itemArray[i].count) {
                newInventory[index].count += itemArray[i].count;
                i++;
              } else {
                newInventory[index].count += spaceLeft;
                itemArray[i].count -= spaceLeft;
              }
            }
          }
        });
        return newInventory;
      });
    },
    [types, items]
  );

  const handleMouseEnter = useCallback(
    (index, inventoryType, itemID = null) => {
      if (index === null && itemID === null) return;
      setLastHovered({ type: inventoryType, id: index });
      const readable =
        items?.[
          itemID !== null ? itemID : inventories[inventoryType][index]?.id
        ]?.readable;
      if (!heldItem.id && readable !== null) setTooltip(readable);
    },
    [inventories, items, heldItem]
  );

  const handleMouseLeave = useCallback(() => {
    setLastHovered({ type: null, id: null });
    setTooltip("");
  }, []);

  const handleKeyDown = useCallback(
    (key) => {
      const numKey = Number(key) - 1;
      if (lastHovered.id === null) return;
      const { type, id } = lastHovered;
      const item = inventories[type][id];
      const hotbarItem = inventories["hotbar"][numKey];
      const newInventories = { ...inventories };
      // exchange items from hotbar slot to hovered slot
      newInventories[type][id] = hotbarItem;
      newInventories["hotbar"][numKey] = item;
      setInventories(newInventories);
      setTooltip("");
    },
    [lastHovered]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyDown(e.key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handleKeyDown]);

  return (
    <AppContext.Provider
      value={{
        items,
        screen,
        setScreen,
        heldItem,
        setHeldItem,
        clickReference,
        setClickReference,
        mousePosition,
        setMousePosition,
        isLeftDragging,
        setIsLeftDragging,
        inventories,
        setInventory,
        insertInventoryItem,
        tooltip,
        handleMouseEnter,
        handleMouseLeave,
        skin,
        setSkin,
        setLastHovered,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useApp };
