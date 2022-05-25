import { getDir, stdPath } from '..';

describe('getDir', () => {
  test('Should get the right directory of file', () => {
    const src = __filename;
    const target = stdPath(__filename, '..');

    expect(getDir(src)).toBe(target);
  });

  test('Should get the right directory of folder', () => {
    const src = __dirname;
    const target = stdPath(src, '..');

    expect(getDir(src)).toBe(target);
  });

  test('Should handle . and ..', () => {
    const src = `${__filename}/../.`;
    const target = stdPath(__dirname);

    expect(getDir(src)).toBe(target);
  });
});
