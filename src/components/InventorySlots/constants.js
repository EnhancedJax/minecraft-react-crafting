export const EMPTY_ITEM = { id: null, count: 0 };
export const EMPTY_INVENTORY = (rows, cols) =>
  Array(rows * cols).fill(EMPTY_ITEM);

export const PLAYER_DEFAULT_INVENTORY = [
  { id: 739, count: 1 },
  { id: 774, count: 1 },
  { id: 683, count: 1 },
  { id: 772, count: 16 },
  { id: 772, count: 16 },
  { id: 818, count: 1 },
  { id: 4, count: 64 },
  { id: 776, count: 64 },
  { id: 109, count: 64 },
];
