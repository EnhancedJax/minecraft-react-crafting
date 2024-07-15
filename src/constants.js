import CHEST_SOUND from "./assets/chest.mp3";
import CLICK_SOUND from "./assets/click.mp3";
import { EMPTY_ITEM } from "./components/InventorySlots/constants";
import Chest from "./components/screens/Chest";
import CraftingTable from "./components/screens/CraftingTable";
import Inventory from "./components/screens/Inventory";

const PLAYER_DEFAULT_HOTBAR = [
  { id: 795, count: 1 }, // axe
  { id: 797, count: 1 }, // sword
  { id: 1143, count: 1 }, // crossbow
  EMPTY_ITEM,
  EMPTY_ITEM,
  { id: 844, count: 32 }, // golden apple
  { id: 869, count: 1 }, // water
  { id: 22, count: 64 }, // cobble
  { id: 950, count: 48 }, // chicken
];

const PLAYER_DEFAULT_INVENTORY = [
  { id: 761, count: 64 }, // arrow
  { id: 764, count: 12 }, // diamond
  { id: 774, count: 44 }, // gold
  { id: 1116, count: 1 }, // shield
  { id: 23, count: 64 }, // planks
  { id: 23, count: 64 }, // planks
  { id: 23, count: 64 }, // planks
  { id: 23, count: 64 }, // planks
];

const CHEST_DEFAULT_INVENTORY = [
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
    defaultInventory: PLAYER_DEFAULT_HOTBAR,
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
    sound: new Audio(CLICK_SOUND),
  },
  {
    id: "craftingTable",
    name: "Crafting Table",
    component: <CraftingTable />,
    sound: new Audio(CLICK_SOUND),
  },
  {
    id: "chest",
    name: "Chest",
    component: <Chest />,
    sound: new Audio(CHEST_SOUND),
  },
];
