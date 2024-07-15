import recipes from "../assets/recipes.json";
Object.freeze(recipes);

export function findMatchingRecipe(inventory, size) {
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
  const inventoryCounts = inventoryIds.reduce((counts, id) => {
    if (id !== null) {
      counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  }, {});

  const recipeCounts = ingredients.reduce((counts, id) => {
    counts[id] = (counts[id] || 0) + 1;
    return counts;
  }, {});

  return (
    Object.keys(recipeCounts).length === Object.keys(inventoryCounts).length &&
    Object.entries(recipeCounts).every(
      ([id, count]) => inventoryCounts[id] === count
    )
  );
}

function matchInShape(shape, inventoryIds, size) {
  const inventoryGrid = [];
  for (let i = 0; i < size; i++) {
    inventoryGrid.push(inventoryIds.slice(i * size, (i + 1) * size));
  }

  const shapeHeight = shape.length;
  const shapeWidth = Math.max(...shape.map((row) => row.length));

  for (let i = 0; i <= size - shapeHeight; i++) {
    for (let j = 0; j <= size - shapeWidth; j++) {
      if (checkShapeMatch(shape, inventoryGrid, i, j, size)) {
        return true;
      }
    }
  }
  return false;
}

function checkShapeMatch(shape, grid, startRow, startCol, size) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const shapeRow = i - startRow;
      const shapeCol = j - startCol;

      if (
        shapeRow >= 0 &&
        shapeRow < shape.length &&
        shapeCol >= 0 &&
        shapeCol < shape[shapeRow].length
      ) {
        const shapeItem = shape[shapeRow][shapeCol];
        const gridItem = grid[i][j];

        if (shapeItem === null && gridItem !== null) return false;
        if (shapeItem !== null && shapeItem !== 0 && shapeItem !== gridItem)
          return false;
      } else if (grid[i][j] !== null) {
        return false;
      }
    }
  }
  return true;
}
