export const DEFAULT_STACK_SIZE = 64;
export const EMPTY_ITEM = { id: null, count: 0 };
export const EMPTY_INVENTORY = (rows, cols) =>
  Array(rows * cols).fill(EMPTY_ITEM);

// for manual generation
export const STACK_ONE_RANGES = [
  "_shovel",
  "_axe",
  "_pickaxe",
  "_hoe",
  "_sword",
  "clock",
  "compass",
  "fishing_rod",
  "potion",
  "chestplate",
  "helmet",
  "leggings",
  "boots",
  "_bucket",
  "shield",
  "elytra",
  "trident",
  "crossbow",
  "bow",
];
export const STACK_16_RANGES = [
  "snowball",
  ":egg",
  "_egg",
  "sign",
  "bottle",
  "banner",
  "book",
  "pearl",
  "armor_stand",
];

// generated manually
export const MAX_STACK_SIZES = [
  {
    size: 1,
    ranges: [
      [666, 689],
      [691, 698],
      [705, 706],
      [710, 710],
      [734, 766],
      [774, 775],
      [818, 820],
      [868, 868],
    ],
  },
  {
    size: 16,
    ranges: [
      [412, 427],
      [516, 516],
      [609, 609],
      [612, 612],
      [614, 621],
      [632, 632],
      [708, 709],
      [772, 773],
      [817, 817],
      [872, 872],
      [874, 874],
      [886, 893],
      [895, 958],
      [964, 965],
    ],
  },
];

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
