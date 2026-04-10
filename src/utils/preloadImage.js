/**
 * Preload an image by URL so it's in the browser cache when needed.
 * @param {string} url - Image URL to preload
 */
export function preloadImage (url) {
  if (!url || typeof url !== 'string' || url.startsWith('data:')) return
  try {
    const img = new Image()
    img.src = url
  } catch (_) {}
}
