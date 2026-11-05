import { useEffect, useState } from 'react';

// Logo → its main colour ('rgb(r g b)' or null), worked out once per image
const cache = new Map();

/**
 * The main colour of an image: draws it small, ignores transparent, near-white, near-black and grey pixels, groups the
 * rest into colour buckets and averages the biggest one (weighted towards stronger colours). null when the image has
 * no clear colour (e.g. a black or grey logo) or can't be read (another site's image without CORS).
 */
function mainColor(img) {
  const size = 48;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 128) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (max < 45 || sat < 0.28 || (max > 235 && sat < 0.35)) continue; // black, grey, white-ish
    const key = `${r >> 5},${g >> 5},${b >> 5}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, w: 0 };
    const w = 0.5 + sat; // stronger colours count a little more
    bucket.r += r * w;
    bucket.g += g * w;
    bucket.b += b * w;
    bucket.w += w;
    buckets.set(key, bucket);
  }
  let best = null;
  for (const bucket of buckets.values()) if (!best || bucket.w > best.w) best = bucket;
  if (!best || best.w < 8) return null;
  return `rgb(${Math.round(best.r / best.w)} ${Math.round(best.g / best.w)} ${Math.round(best.b / best.w)})`;
}

/** The main colour of a logo (see mainColor) — null while loading, for no logo, or a colourless one */
export function useLogoColor(src) {
  const [color, setColor] = useState(() => (src ? (cache.get(src) ?? null) : null));
  useEffect(() => {
    if (!src) return setColor(null);
    if (cache.has(src)) return setColor(cache.get(src));
    let alive = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let c = null;
      try {
        c = mainColor(img);
      } catch {
        c = null; // unreadable image — fall back to the category colour
      }
      cache.set(src, c);
      if (alive) setColor(c);
    };
    img.onerror = () => cache.set(src, null);
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);
  return color;
}
