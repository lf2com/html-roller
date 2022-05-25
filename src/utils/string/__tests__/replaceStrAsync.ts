import { replaceStrAsync } from '..';

describe('replaceStrAsync', () => {
  const rndStr = () => Math.random().toString();

  test('Should work with string/string', async () => {
    const src = rndStr();
    const search = '.';
    const replacer = rndStr();
    const result = await replaceStrAsync(src, search, replacer);

    expect(typeof result).toBe('string');
    expect(result).toBe(src.replace(search, replacer));
  });

  test('Should work with regex/string', async () => {
    const src = rndStr();
    const search = /(.)(.)/g;
    const replacer = '$2$1';
    const result = await replaceStrAsync(src, search, replacer);

    expect(typeof result).toBe('string');
    expect(result).toBe(src.replace(search, replacer));
  });

  test('Should work with string/function', async () => {
    const src = rndStr();
    const val = rndStr();
    const search = '.';
    const replacer = () => val;
    const result = await replaceStrAsync(src, search, replacer);

    expect(typeof result).toBe('string');
    expect(result).toBe(src.replace(search, replacer));
  });

  test('Shoule work with regex/function', async () => {
    const src = rndStr();
    const search = /(.)(.)/g;
    const replacer = (_: any, a1: string, a2: string) => `${a2}${a1}`;
    const result = await replaceStrAsync(src, search, replacer);

    expect(typeof result).toBe('string');
    expect(result).toBe(src.replace(search, replacer));
  });
});
