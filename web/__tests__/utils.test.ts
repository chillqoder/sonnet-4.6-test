import { findAllStrings, isLikelyImageUrl } from '../src/lib/utils';

describe('findAllStrings', () => {
  it('returns a flat string value', () => {
    expect(findAllStrings('hello')).toEqual([{ value: 'hello', path: '' }]);
  });

  it('traverses a flat object', () => {
    const result = findAllStrings({ a: 'foo', b: 'bar' });
    expect(result).toEqual(
      expect.arrayContaining([
        { value: 'foo', path: 'a' },
        { value: 'bar', path: 'b' },
      ])
    );
  });

  it('traverses a nested object', () => {
    const result = findAllStrings({ outer: { inner: 'deep' } });
    expect(result).toEqual([{ value: 'deep', path: 'outer.inner' }]);
  });

  it('traverses an array', () => {
    const result = findAllStrings(['x', 'y']);
    expect(result).toEqual([
      { value: 'x', path: '[0]' },
      { value: 'y', path: '[1]' },
    ]);
  });

  it('traverses mixed nested structures', () => {
    const obj = {
      id: 'abc',
      meta: { tags: ['tag1', 'tag2'] },
      image: 'https://example.com/img.jpg',
    };
    const result = findAllStrings(obj);
    const values = result.map(r => r.value);
    expect(values).toContain('abc');
    expect(values).toContain('tag1');
    expect(values).toContain('tag2');
    expect(values).toContain('https://example.com/img.jpg');
  });

  it('ignores numbers, booleans, and null', () => {
    const result = findAllStrings({ n: 42, b: true, nul: null, s: 'keep' });
    expect(result).toEqual([{ value: 'keep', path: 's' }]);
  });

  it('returns empty array for empty object', () => {
    expect(findAllStrings({})).toEqual([]);
  });

  it('returns empty array for number input', () => {
    expect(findAllStrings(42)).toEqual([]);
  });
});

describe('isLikelyImageUrl', () => {
  it('accepts URLs with image extensions', () => {
    expect(isLikelyImageUrl('https://example.com/photo.jpg')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.jpeg')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.png')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.gif')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.webp')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.avif')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.bmp')).toBe(true);
  });

  it('accepts image URLs with query strings', () => {
    expect(isLikelyImageUrl('https://cdn.example.com/img.jpg?v=1&w=200')).toBe(true);
  });

  it('accepts short HTTP URLs without extensions (attempt load)', () => {
    expect(isLikelyImageUrl('https://picsum.photos/200/300')).toBe(true);
  });

  it('rejects non-HTTP strings', () => {
    expect(isLikelyImageUrl('ftp://example.com/photo.jpg')).toBe(false);
    expect(isLikelyImageUrl('photo.jpg')).toBe(false);
    expect(isLikelyImageUrl('just a string')).toBe(false);
  });

  it('rejects long URLs without image extensions', () => {
    const longUrl =
      'https://example.com/' + 'a'.repeat(180) + '/some/path/without/image/extension';
    expect(isLikelyImageUrl(longUrl)).toBe(false);
  });

  it('is case-insensitive for extensions', () => {
    expect(isLikelyImageUrl('https://example.com/IMAGE.JPG')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.PNG')).toBe(true);
  });
});
