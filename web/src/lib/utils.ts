import { ImageStatus, ItemStatus } from '../types';

export function findAllStrings(
  obj: unknown,
  path = ''
): Array<{ value: string; path: string }> {
  const results: Array<{ value: string; path: string }> = [];

  if (typeof obj === 'string') {
    results.push({ value: obj, path });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      results.push(...findAllStrings(item, `${path}[${i}]`));
    });
  } else if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      results.push(...findAllStrings(value, path ? `${path}.${key}` : key));
    }
  }

  return results;
}

export function isLikelyImageUrl(url: string): boolean {
  const hasHttp = /^https?:\/\//i.test(url);
  const hasImageExt = /\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
  return hasHttp && (hasImageExt || url.length < 200);
}

export function getItemTitle(obj: unknown, index: number): string {
  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
    const o = obj as Record<string, unknown>;
    if (typeof o.title === 'string' && o.title) return o.title;
    if (typeof o.name === 'string' && o.name) return o.name;
    if (o.id !== undefined) return String(o.id);
  }
  return `#${index + 1}`;
}

export function computeItemStatus(
  imageUrls: string[],
  urlCache: Record<string, ImageStatus>
): ItemStatus {
  if (imageUrls.length === 0) return 'no_images';

  const statuses = imageUrls.map(url => urlCache[url] ?? 'pending');
  const hasPending = statuses.some(s => s === 'pending' || s === 'loading');
  if (hasPending) return 'loading';

  const validCount = statuses.filter(s => s === 'valid').length;
  const brokenCount = statuses.filter(s => s === 'broken').length;

  if (validCount === imageUrls.length) return 'all_valid';
  if (brokenCount === imageUrls.length) return 'all_broken';
  return 'some_broken';
}

export function formatDateYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}
