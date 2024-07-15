export const EMPTY_ITEM = { id: null, count: 0 };
export const EMPTY_INVENTORY = (rows, cols) =>
  Array(rows * cols).fill(EMPTY_ITEM);

export const SHIFT_MOVE_TO = {
  hotbar: {
    // the inventory type
    inventory: "inventory", // the screen -> inventory type to move to
    craftingTable: "craftingTable",
    chest: "chest",
  },
  inventory: {
    inventory: "hotbar",
    craftingTable: "craftingTable",
    chest: "chest",
  },
  craftingTable: {
    craftingTable: "inventory",
  },
  chest: {
    chest: "inventory",
  },
  craftingTableResult: {
    craftingTable: "inventory",
  },
  inventoryCraftingResult: {
    inventory: "inventory",
  },
};

// export const SHIFT_MOVE_TO_ITEMS = {
//   '_chestplate': {

//   }
// }
