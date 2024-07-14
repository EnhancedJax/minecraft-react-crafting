import * as THREE from "three";

export function createBodyPart(width, height, depth, materials, x, y, z) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.position.set(x, y, z);
  return mesh;
}

export function getTexture(texture, x, y, width, height) {
  if (!texture.image) {
    console.error("Texture image not loaded");
    return new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Fallback red material
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.drawImage(texture.image, x, y, width, height, 0, 0, width, height);
  const newTexture = new THREE.CanvasTexture(canvas);
  newTexture.magFilter = THREE.NearestFilter;
  newTexture.minFilter = THREE.NearestFilter;
  return new THREE.MeshLambertMaterial({
    map: newTexture,
    lightMap: newTexture,
    lightMapIntensity: 1.6,
  });
}
