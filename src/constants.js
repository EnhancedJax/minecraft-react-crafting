import Chest from "./components/screens/Chest";
import CraftingTable from "./components/screens/CraftingTable";
import Inventory from "./components/screens/Inventory";

export const PLAYER_DEFAULT_INVENTORY = [
  { id: 775, count: 1 },
  { id: 78, count: 1 },
  { id: 115, count: 1 },
  { id: 149, count: 1 },
];

export const CHEST_DEFAULT_INVENTORY = [
  { id: 807, count: 32 },
  { id: 770, count: 32 },
  { id: 27, count: 32 },
];

// initialize the inventories
export const INVENTORIES = {
  armor: {
    rows: 4,
    cols: 1,
  },
  hotbar: {
    rows: 1,
    cols: 9,
  },
  inventory: {
    rows: 3,
    cols: 9,
    defaultInventory: PLAYER_DEFAULT_INVENTORY,
  },
  inventoryCrafting: {
    rows: 2,
    cols: 2,
  },
  inventoryCraftingResult: {
    rows: 1,
    cols: 1,
  },
  chest: {
    rows: 3,
    cols: 9,
    defaultInventory: CHEST_DEFAULT_INVENTORY,
  },
  craftingTable: {
    rows: 3,
    cols: 3,
  },
  craftingTableResult: {
    rows: 1,
    cols: 1,
  },
};

export const SCREENS = [
  {
    id: "inventory",
    name: "Inventory",
    component: <Inventory />,
  },
  {
    id: "craftingTable",
    name: "Crafting Table",
    component: <CraftingTable />,
  },
  {
    id: "chest",
    name: "Chest",
    component: <Chest />,
  },
];
