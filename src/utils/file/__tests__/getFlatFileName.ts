import { getFileExtension, getFlatFileName, stdPath } from '..';

describe('getFlatFileNames', () => {
  const rndStr = () => (Math.random() + 0.5).toString().replace('.', '');

  test('Should flatten path', () => {
    const src = rndStr();
    const result = getFlatFileName(src);

    expect(result).toBe(src);
    expect(getFileExtension(result)).toBe(getFileExtension(src));
  });

  test('Should flatten and hash path', () => {
    const src = `${rndStr()}.${rndStr()}`;
    const result = getFlatFileName(src, { hash: true });

    expect(typeof result).toBe('string');

    const [name, ext] = result.split('.');

    expect(name.length).toBe(32);
    expect(`.${ext}`).toBe(getFileExtension(src));
  });

  test('Should flatten long path', () => {
    const srcSingle = rndStr();
    const src = [
      srcSingle,
      `${rndStr()}-${rndStr()}`,
      `${rndStr()}_${rndStr()}`,
      `${rndStr()} ${rndStr()}`,
      `${rndStr()}.${rndStr()}`,
      `${rndStr()}-${rndStr()} ${rndStr()}_${rndStr()}.${rndStr()}`,
      `${rndStr()}.${rndStr()}`,
    ].join('/');
    const result = getFlatFileName(src);
    const resultSingle = getFlatFileName(srcSingle);

    expect(resultSingle).toBe(srcSingle);
    expect(/[\\/]/.test(resultSingle)).toBe(false);
    expect(/[\\/]/.test(result)).toBe(false);
    expect(getFileExtension(result)).toBe(getFileExtension(src));
    expect(result.split(/[^a-z0-9]/).sort())
      .toEqual(src.split(/[^a-z0-9]/).sort());
  });

  test('Should have the same target', () => {
    const src = stdPath(rndStr());
    const srcRun = stdPath(src, rndStr(), '..', '.', '..', src);

    expect(getFlatFileName(src)).toBe(getFlatFileName(srcRun));
    expect(getFlatFileName(src, { hash: true }))
      .toBe(getFlatFileName(srcRun, { hash: true }));
  });

  test('Should have the same name with different extensions', () => {
    const ext = rndStr();

    expect(getFileExtension(getFlatFileName(`${rndStr()}${ext}`)))
      .toBe(getFileExtension(getFlatFileName(`${rndStr()}${ext}`)));
  });
});
