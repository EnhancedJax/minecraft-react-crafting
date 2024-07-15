export const EMPTY_ITEM = { id: null, count: 0 };
export const EMPTY_INVENTORY = (rows, cols) =>
  Array(rows * cols).fill(EMPTY_ITEM);
