import { useEffect, useMemo, useState } from "react";
import { SCREENS } from "../constants";
import { useApp } from "../provider";
import { findMatchingRecipe } from "../utils/crafting";
import InventoryGroup from "./InventoryGroup";
import { EMPTY_ITEM, SHIFT_MOVE_TO } from "./InventorySlots/constants";

export default function CraftingResultSlot({
  type,
  resultOfType,
  className,
  ...props
}) {
  const { screen, inventories, setInventory, insertInventoryItem } = useApp();
  const [matchedRecipe, setMatchedRecipe] = useState(null);

  const craftingInventory = useMemo(
    () => inventories[resultOfType] || [],
    [inventories, resultOfType]
  );
  const craftingSize = useMemo(
    () => Math.sqrt(craftingInventory.length),
    [craftingInventory]
  );

  useEffect(() => {
    const newMatchedRecipe = findMatchingRecipe(
      craftingInventory,
      craftingSize
    );
    const newResultItem = newMatchedRecipe
      ? newMatchedRecipe.result
      : EMPTY_ITEM;
    setMatchedRecipe(newMatchedRecipe);
    setInventory(type, [newResultItem]);
  }, [craftingInventory, craftingSize]);

  const pickUpCallback = (isShift) => {
    while (true) {
      let newInventory = [...inventories[resultOfType]];
      const currentCraftingInventoryID = inventories[resultOfType].map(
        (item) => item.id
      );
      const recipeType = matchedRecipe.ingredients ? "ingredients" : "inShape";
      let i = 0;
      matchedRecipe[recipeType].flat().forEach((id) => {
        const index =
          newInventory.slice(i).findIndex((item) => item.id === id) + i;
        newInventory[index].count -= 1;
        if (newInventory[index].count === 0) {
          newInventory[index] = EMPTY_ITEM;
        }
        i = index + 1;
      });
      setInventory(resultOfType, newInventory);
      if (!isShift) break;
      if (
        newInventory
          .map((item) => item.id)
          .every((id, index) => id === currentCraftingInventoryID[index])
      ) {
        insertInventoryItem(
          [{ ...matchedRecipe.result }],
          SHIFT_MOVE_TO[type][SCREENS[screen].id]
        );
      } else {
        break;
      }
    }
    setMatchedRecipe(null);
  };

  return (
    <InventoryGroup
      type={type}
      className={className}
      pickUpCallback={pickUpCallback}
      allowRightClickPickup={false}
      canPutDown={() => false}
      {...props}
    />
  );
}
