export interface ParseResult {
  items: unknown[];
  path: string | null;
  ambiguous: boolean;
  arrays: Array<{ path: string; length: number }>;
  error?: string;
}

export function parseJson(text: string): { data?: unknown; error?: string } {
  try {
    return { data: JSON.parse(text) };
  } catch (e) {
    return { error: `Invalid JSON: ${(e as Error).message}` };
  }
}

export function findArrays(
  obj: unknown,
  path = ''
): Array<{ path: string; length: number }> {
  const results: Array<{ path: string; length: number }> = [];

  if (Array.isArray(obj)) {
    results.push({ path: path || 'root', length: obj.length });
  } else if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const childPath = path ? `${path}.${key}` : key;
      if (Array.isArray(value)) {
        results.push({ path: childPath, length: value.length });
      } else {
        results.push(...findArrays(value, childPath));
      }
    }
  }

  return results;
}

export function getByPath(obj: unknown, path: string): unknown {
  if (path === 'root' || path === '') return obj;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function autoDetectArray(data: unknown): ParseResult {
  if (Array.isArray(data)) {
    return { items: data, path: null, ambiguous: false, arrays: [] };
  }

  const arrays = findArrays(data);

  if (arrays.length === 0) {
    return {
      items: [],
      path: null,
      ambiguous: false,
      arrays: [],
      error: 'No arrays found in JSON',
    };
  }

  if (arrays.length === 1) {
    const arr = getByPath(data, arrays[0].path);
    return {
      items: arr as unknown[],
      path: arrays[0].path,
      ambiguous: false,
      arrays: [],
    };
  }

  // Multiple arrays — return longest as suggestion
  const sorted = [...arrays].sort((a, b) => b.length - a.length);
  return { items: [], path: sorted[0].path, ambiguous: true, arrays: sorted };
}
