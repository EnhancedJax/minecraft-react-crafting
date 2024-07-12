import { PLAYER_DEFAULT_INVENTORY } from "./components/Inventory/constants";

export const INVENTORIES = {
  armor: {
    rows: 4,
    cols: 1,
  },
  player: {
    rows: 1,
    cols: 9,
  },
  chest: {
    rows: 3,
    cols: 9,
    defaultInventory: PLAYER_DEFAULT_INVENTORY,
  },
  craftingTable: {
    rows: 2,
    cols: 2,
  },
};
