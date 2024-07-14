import { PLAYER_DEFAULT_INVENTORY } from "./components/InventorySlots/constants";
import Chest from "./components/screens/Chest";
import CraftingTable from "./components/screens/CraftingTable";
import Inventory from "./components/screens/Inventory";

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
  chest: {
    rows: 3,
    cols: 9,
  },
  craftingTable: {
    rows: 3,
    cols: 3,
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
