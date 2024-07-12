export default async function getTextures() {
  const textures = await import(
    "minecraft-textures/dist/textures/json/1.16.json"
  );
  return textures;
}
