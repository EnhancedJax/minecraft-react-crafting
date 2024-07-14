export async function getImageDimensions(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const image = await createImageBitmap(blob);
    return { width: image.width, height: image.height };
  } catch (error) {
    return { width: 0, height: 0 };
  }
}
