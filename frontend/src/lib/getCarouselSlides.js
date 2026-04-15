import fs from 'fs';
import path from 'path';

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function captionFromFilename(filename) {
  const base = filename.replace(IMAGE_EXT, '');
  const words = base.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!words) return 'Gallery';
  return words.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/**
 * Reads `public/images/carousel/` at build/request time (server only).
 * Returns sorted slide objects with real file extensions in `src`.
 */
export function getCarouselSlides() {
  const dir = path.join(process.cwd(), 'public', 'images', 'carousel');
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = entries
    .filter((d) => d.isFile() && IMAGE_EXT.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  return files.map((name) => {
    const caption = captionFromFilename(name);
    return {
      src: `/images/carousel/${encodeURIComponent(name)}`,
      alt: `Gallery: ${caption}`,
      caption,
    };
  });
}
