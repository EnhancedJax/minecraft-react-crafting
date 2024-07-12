import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EMPTY_INVENTORY, EMPTY_ITEM } from "./components/Inventory/constants";
import { getTextures, maxStackSize } from "./utils";

// Create a new context
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// Create a provider component
const AppProvider = ({ children }) => {
  const [playerInventory, setPlayerInventory] = useState(EMPTY_INVENTORY(1, 9));
  const [chestInventory, setChestInventory] = useState(EMPTY_INVENTORY(4, 9));
  const [craftingTableInventory, setCraftingTableInventory] = useState(
    EMPTY_INVENTORY(3, 3)
  );
  const [items, setItems] = useState([]);
  const [heldItem, setHeldItem] = useState(EMPTY_ITEM);
  const [isLeftDragging, setIsLeftDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickReference, setClickReference] = useState(null);

  const [types, setTypes] = useState([]);

  useEffect(() => {
    (async () => {
      const { items } = await getTextures();
      setItems(items);
    })();

    const arrayOfChildren = Array.isArray(children) ? children : [children];
    const newTypes = arrayOfChildren
      .filter((child) => child.type.name === "InventoryProvider")
      .map((child) => child.props.type);
    arrayOfChildren
      .filter(
        (child) =>
          child.type.name === "InventoryProvider" &&
          child.props.defaultInventory
      )
      .forEach((child) => {
        insertInventoryItem(
          child.props.defaultInventory,
          child.props.type,
          newTypes
        );
      });
    setTypes(newTypes);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [children]);

  const insertInventoryItem = useCallback(
    (itemArray, targetType, syncTypes) => {
      if (!itemArray || !targetType) return console.error("Missing arguments");
      const targetTypes = syncTypes || types;
      let i = 0;
      if (!targetTypes.includes(targetType))
        return console.error("Invalid target type", targetType);
      const setter = eval(
        `set${targetType[0].toUpperCase()}${targetType.slice(1)}Inventory`
      );
      setter((prev) => {
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
        craftingTableInventory,
        setCraftingTableInventory,
        playerInventory,
        setPlayerInventory,
        chestInventory,
        setChestInventory,
        insertInventoryItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useApp };
