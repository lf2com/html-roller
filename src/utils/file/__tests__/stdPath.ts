import fs from 'fs';
import { stdPath } from '..';

describe('stdPath', () => {
  const convSlash = (src: string) => src.replace(/\\/g, '/');

  test('Should convert \\ to /', () => {
    const src = __filename;

    expect(stdPath(src)).toBe(convSlash(src));
  });

  test('Should point to the same path', () => {
    const src = __filename;

    expect(fs.readFileSync(stdPath(src)))
      .toStrictEqual(fs.readFileSync(src));
  });

  test('Should end with / in case of folder', () => {
    expect(stdPath(__dirname)).toBe(convSlash(`${__dirname}/`));
    expect(stdPath(`${__dirname}/`)).toBe(convSlash(`${__dirname}/`));
    expect(stdPath(`${__filename}/`)).toBe(convSlash(`${__filename}/`));
  });

  test('Should handle . and ..', () => {
    const src = `${__filename}/../.`;

    expect(stdPath(src)).toBe(convSlash(`${__dirname}/`));
  });

  test('Should support multiple arguments', () => {
    const src = __filename.split(/[\\/]/);

    expect(stdPath(...src)).toBe(convSlash(__filename));
  });
});
