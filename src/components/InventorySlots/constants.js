export const EMPTY_ITEM = { id: null, count: 0 };
export const EMPTY_INVENTORY = (rows, cols) =>
  Array(rows * cols).fill(EMPTY_ITEM);

export const PLAYER_DEFAULT_INVENTORY = [
  { id: 775, count: 1 },
  { id: 78, count: 1 },
  { id: 115, count: 1 },
  { id: 149, count: 1 },
];
