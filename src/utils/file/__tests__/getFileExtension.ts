import { getFileExtension } from '..';

describe('getFileExtension', () => {
  const getExt = (src: string) => `.${src.split('.').pop()}`;

  test('Should return file extension', () => {
    const src = __filename;
    const target = getExt(src);

    expect(getFileExtension(src)).toBe(target);
  });

  test('Should return empty string on path without extension', () => {
    const src = __filename
      .split('.')
      .slice(0, -1)
      .join('.');

    expect(getFileExtension(src)).toBe('');
    expect(getFileExtension(__dirname)).toBe('');
  });

  test('Should be able to switch case', () => {
    const src = __filename.toUpperCase();
    const target = getExt(src);
    const targetLowerCase = target?.toLowerCase();

    expect(getFileExtension(src)).toBe(targetLowerCase);
    expect(getFileExtension(src, { keepCase: true })).toBe(target);
    expect(getFileExtension(src, { keepCase: false })).toBe(targetLowerCase);
  });
});
