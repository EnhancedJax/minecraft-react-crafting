import {
  DEFAULT_STACK_SIZE,
  MAX_STACK_SIZES,
} from "../components/Inventory/constants";

function getRanges(searchTerms, items) {
  const matchingIndices = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < searchTerms.length; j++) {
      if (items[i].id.includes(searchTerms[j])) {
        // console.log("Matched", items[i].id, "at index", i);
        matchingIndices.push(i);
        break; // Move to the next item
      }
    }
  }

  // Group the indices into ranges
  const matchingRanges = [];
  let start = null;
  for (let i = 0; i < matchingIndices.length; i++) {
    if (start === null) {
      start = matchingIndices[i];
    }
    if (
      i === matchingIndices.length - 1 ||
      matchingIndices[i] + 1 !== matchingIndices[i + 1]
    ) {
      matchingRanges.push([start, matchingIndices[i]]);
      start = null;
    }
  }

  return matchingRanges;
}

async function getTextures() {
  const textures = await import(
    "minecraft-textures/dist/textures/json/1.16.json"
  );
  return textures;
}

function maxStackSize(id) {
  const stackSize = DEFAULT_STACK_SIZE;
  const maxStack = MAX_STACK_SIZES.find((stack) =>
    stack.ranges.some((range) => id >= range[0] && id <= range[1])
  );
  return maxStack ? maxStack.size : stackSize;
}

export { getRanges, getTextures, maxStackSize };
