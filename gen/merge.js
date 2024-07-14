const fs = require("fs");
const path = require("path");

// Read the JSON files
const mcItems = JSON.parse(fs.readFileSync("./mc_items.json", "utf8"));
const mcTextures = JSON.parse(fs.readFileSync("./mc_textures.json", "utf8"));

// Create a map of textures for quick lookup
const textureMap = new Map(
  mcTextures.items.map((item) => [item.id.replace("minecraft:", ""), item])
);

// Process and combine the data
const resultItems = mcItems.map((item) => {
  const texture = textureMap.get(item.name);
  if (!texture) {
    console.log(`No texture found for item: ${item.name}`);
  }
  return {
    readable: texture ? texture.readable : item.displayName,
    name: item.name,
    texture: texture ? texture.texture : null,
    stackSize: item.stackSize,
  };
});

// Sort the items by their 'id'
resultItems.sort((a, b) => {
  const idA = mcItems.find((item) => item.name === a.name).id;
  const idB = mcItems.find((item) => item.name === b.name).id;
  return idA - idB;
});

// Create the result object
const result = {
  items: resultItems,
};

// Write the result to a JSON file
const outputPath = path.resolve(__dirname, "../src/assets/items.json");
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`Result written to ${outputPath}`);
