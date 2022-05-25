import fs from 'fs';
import { readFileSyncInText } from '..';

describe('readFileSyncInText', () => {
  test('Should return text of file', () => {
    const src = __filename;
    const result = readFileSyncInText(src);

    expect(typeof result).toBe('string');
    expect(result).toBe(fs.readFileSync(src, { encoding: 'utf8' }));
  });

  test('Should throw error if file not found', () => {
    expect(() => readFileSyncInText('')).toThrowError();
  });
});
