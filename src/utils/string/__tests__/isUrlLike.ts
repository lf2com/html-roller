import { isUrlLike } from '..';

describe('isUrlLike', () => {
  const rndStr = () => Math.random().toString();
  const protocols = [
    'http://', 'https://', 'file:///', 'ws://', 'wss://',
  ];

  test('Should return true for valid URLs', () => {
    const path = rndStr();

    protocols.forEach((protocol) => {
      const url = `${protocol}${path}`;
      const port = rndStr().slice(-5);
      const qs = `?${rndStr()}`;
      const hash = `#${rndStr()}`;

      expect(isUrlLike(protocol)).toBe(true);
      expect(isUrlLike(url)).toBe(true);
      expect(isUrlLike(hash)).toBe(true);
      expect(isUrlLike(`${url}:${port}`)).toBe(true);
      expect(isUrlLike(`${url}:${port}${qs}`)).toBe(true);
      expect(isUrlLike(`${url}:${port}${hash}`)).toBe(true);
      expect(isUrlLike(`${url}:${port}${qs}${hash}`)).toBe(true);
      expect(isUrlLike(`${protocol.toUpperCase()}${path}`)).toBe(true);
    });
  });

  test('Should return false for invalid URLs', () => {
    const path = rndStr();

    expect(isUrlLike('')).toBe(false);
    expect(isUrlLike(path)).toBe(false);
    expect(isUrlLike(`?${path}`)).toBe(false);
    expect(isUrlLike(`http${path}`)).toBe(false);
    expect(isUrlLike(`htp://${path}`)).toBe(false);
    expect(isUrlLike(`http:/${path}`)).toBe(false);
  });
});
