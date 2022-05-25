import { getAbsPath, getFileName, stdPath } from '..';

describe('getAbsPath', () => {
  const rndNum = (l = 0, u = l + 9) => Math.floor(l + (u - l) * Math.random());
  const getStrs = (f: () => unknown, n = 1) => new Array(n)
    .fill(0)
    .map(() => f());
  const repeatStr = (f: () => unknown, n = 1, s = '') => getStrs(f, n).join(s);
  const rndChar = (n = 1) => repeatStr(() => (
    String.fromCharCode(Math.floor(97 + 26 * Math.random()))
  ), n);
  const base = rndChar(5);
  const subpaths = getStrs(() => rndChar(rndNum(5, 10)), 3);
  const subpath = subpaths.join('/');

  test('Should return absolute path of source', () => {
    const file = stdPath(__filename);
    const filename = getFileName(file);
    const dir = stdPath(__dirname);
    const dirname = getFileName(dir);

    expect(getAbsPath(file)).toBe(file);
    expect(getAbsPath(dir)).toBe(dir);
    expect(getAbsPath(stdPath('.', getFileName(file)))).toBe(filename);
    expect(getAbsPath(stdPath('.', getFileName(dir)))).toBe(dirname);
    expect(getAbsPath(stdPath('./..', getFileName(dir)))).toBe(`../${dirname}`);
  });

  test('Should return the same paths', () => {
    [
      `/${rndChar()}/${subpath}`,
      `${rndChar()}:/${subpath}`,
      `/${subpath}`,
    ].forEach((str) => {
      expect(getAbsPath(str, base)).toBe(stdPath(str));
    });
  });

  test('Should convert relative paths', () => {
    [
      subpath,
      `./${subpath}`,
      `../${subpath}`,
      `./../${subpath}`,
      `${rndChar(5)}/../${rndChar(5)}/../${subpath}`,
    ].forEach((str) => {
      expect(getAbsPath(str, base)).toBe(stdPath(base, str));
    });
  });
});
