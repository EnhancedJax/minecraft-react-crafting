import { useEffect, useMemo, useState } from "react";
import recipes from "../assets/recipes.json";
import { useApp } from "../provider";
import { EMPTY_ITEM } from "./InventorySlots/constants";
import SpecialSlot from "./SpecialSlot";

export default function CraftingResultSlot({
  resultOfType,
  className,
  ...props
}) {
  const { inventories, setInventory } = useApp();
  const [resultItem, setResultItem] = useState(EMPTY_ITEM);
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
    setMatchedRecipe(newMatchedRecipe);
    setResultItem(newMatchedRecipe ? newMatchedRecipe.result : EMPTY_ITEM);
  }, [craftingInventory, craftingSize]);

  const pickUpCallback = () => {
    if (matchedRecipe) {
      setInventory(resultOfType, (prevInventory) => {
        return prevInventory.map((item, index) => {
          if (item === EMPTY_ITEM) return EMPTY_ITEM;

          if (matchedRecipe.inShape) {
            const row = Math.floor(index / craftingSize);
            const col = index % craftingSize;
            if (
              matchedRecipe.inShape[row] &&
              matchedRecipe.inShape[row][col] !== 0
            ) {
              return item.count > 1
                ? { ...item, count: item.count - 1 }
                : EMPTY_ITEM;
            }
          } else if (
            matchedRecipe.ingredients &&
            matchedRecipe.ingredients.includes(item.id)
          ) {
            return item.count > 1
              ? { ...item, count: item.count - 1 }
              : EMPTY_ITEM;
          }

          return item;
        });
      });
    }
    setResultItem(EMPTY_ITEM);
    setMatchedRecipe(null);
  };

  return (
    <SpecialSlot
      className={className}
      {...props}
      item={resultItem}
      pickUpCallback={pickUpCallback}
      canPutDown={() => false}
    />
  );
}

function findMatchingRecipe(inventory, size) {
  const inventoryIds = inventory.map((item) => (item ? item.id : null));

  for (const recipeList of Object.values(recipes)) {
    for (const recipe of recipeList) {
      if (
        recipe.ingredients &&
        matchIngredients(recipe.ingredients, inventoryIds)
      ) {
        return recipe;
      }
      if (recipe.inShape && matchInShape(recipe.inShape, inventoryIds, size)) {
        return recipe;
      }
    }
  }
  return null;
}

function matchIngredients(ingredients, inventoryIds) {
  const inventoryIdSet = new Set(inventoryIds.filter((id) => id !== null));
  return (
    ingredients.every((id) => inventoryIdSet.has(id)) &&
    inventoryIdSet.size === ingredients.length
  );
}

function matchInShape(shape, inventoryIds, size) {
  if (size === 2 && shape.length === 3) return false;

  const inventoryGrid = [];
  for (let i = 0; i < size; i++) {
    inventoryGrid.push(inventoryIds.slice(i * size, (i + 1) * size));
  }

  for (let i = 0; i <= size - shape.length; i++) {
    for (let j = 0; j <= size - shape[0].length; j++) {
      if (checkShapeMatch(shape, inventoryGrid, i, j)) {
        return true;
      }
    }
  }
  return false;
}

function checkShapeMatch(shape, grid, startRow, startCol) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (
        shape[i][j] !== 0 &&
        shape[i][j] !== grid[startRow + i][startCol + j]
      ) {
        return false;
      }
    }
  }
  return true;
}
