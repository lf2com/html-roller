import { getFileName } from '..';

describe('getFileName', () => {
  const getName = (src: string) => src.split(/[\\/]/).pop();

  test('Should get the right file name', () => {
    const src = __filename;
    const target = getName(src);

    expect(getFileName(src)).toBe(target);
  });

  test('Should get the right folder name', () => {
    const src = __dirname;
    const target = getName(src);

    expect(getFileName(src)).toBe(target);
  });

  test('Should handle . and ..', () => {
    const src = `${__filename}/../.`;
    const target = getName(__dirname);

    expect(getFileName(src)).toBe(target);
  });
});
