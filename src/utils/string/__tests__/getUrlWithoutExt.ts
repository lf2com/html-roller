import { getUrlWithoutExt } from '..';

describe('getUrlWithoutExt', () => {
  const rndStr = () => Math.random().toString();

  test('Should return URL without query string', () => {
    const str = rndStr();
    const qs = `?${rndStr()}`;
    const hash = `#${rndStr()}`;

    expect(getUrlWithoutExt('')).toBe('');
    expect(getUrlWithoutExt(str)).toBe(str);
    expect(getUrlWithoutExt(`${str}${qs}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${qs}=${rndStr()}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${qs}&${rndStr()}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${qs}&${rndStr()}=${rndStr()}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${hash}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${hash}=${rndStr()}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${hash}&${rndStr()}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${hash}&${rndStr()}=${rndStr()}`)).toBe(str);
    expect(getUrlWithoutExt(`${str}${qs}${hash}`)).toBe(str);
  });
});
