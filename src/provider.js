import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EMPTY_INVENTORY, EMPTY_ITEM } from "./components/Inventory/constants";
import { INVENTORIES } from "./constants";
import { getTextures, maxStackSize } from "./utils";

// Create a new context
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// Create a provider component
const AppProvider = ({ children }) => {
  const types = useMemo(() => Object.keys(INVENTORIES), []);
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
            const stackSize = maxStackSize(itemArray[i].id);
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
    [types]
  );

  return (
    <AppContext.Provider
      value={{
        items,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useApp };
