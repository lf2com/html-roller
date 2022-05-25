import { isLocalPath } from '..';

describe('isLocalPath', () => {
  const rndStr = () => Math.random().toString();

  test('Should work for local paths', () => {
    expect(isLocalPath(__filename)).toBe(true);
    expect(isLocalPath(__dirname)).toBe(true);
    expect(isLocalPath(rndStr())).toBe(false);
  });

  test('Should work for non-local paths', () => {
    expect(isLocalPath(`http://${rndStr()}`)).toBe(false);
  });
});
