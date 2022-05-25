import { getArguments } from '..';

describe('getArguments', () => {
  const rndStr = () => new Array(5)
    .fill(0)
    .map(() => (
      String.fromCharCode(Math.floor(97 + 26 * Math.random()))
    ))
    .join('');
  const list = new Array(3)
    .fill(0)
    .reduce((params) => ({
      ...params,
      [rndStr()]: rndStr(),
    }), {});
  const fullKeys = Object.keys(list);

  test('Should return argv and args', () => {
    const resultEmpty = getArguments();
    const resultNoInput = getArguments({
      inputArgv: [],
    });

    expect(Array.isArray(resultEmpty.argv)).toBe(true);
    expect(typeof resultEmpty.args).toBe('object');
    expect(resultNoInput.argv.length).toBe(0);
    expect(resultNoInput.args).toStrictEqual({});
  });

  test('Should return args', () => {
    fullKeys.forEach((fullKey) => {
      const val = rndStr();
      const shortKey = list[fullKey];
      const resultFull = getArguments({
        argList: list,
        inputArgv: [`--${fullKey}`, val],
      });
      const resultShort = getArguments({
        argList: list,
        inputArgv: [`-${shortKey}`, val],
      });

      expect(resultFull.argv.length).toBe(0);
      expect(Object.keys(resultFull.args).length).toBe(1);
      expect(resultFull.args[fullKey]).toBe(val);
      expect(resultShort.argv.length).toBe(0);
      expect(Object.keys(resultShort.args).length).toBe(1);
      expect(resultShort.args[fullKey]).toBe(val);
    });
  });

  test('Should return argv', () => {
    [
      [rndStr(), rndStr(), rndStr()],
      [`-${rndStr()}`, `--${rndStr()}`],
      [`---${rndStr()}`, `-${rndStr()}-`, `--${rndStr()}-`],
    ].forEach((input) => {
      const result = getArguments({ inputArgv: input });

      expect(result.argv).toEqual(input);
    });
  });

  test('Should keep args of the list', () => {
    const values = fullKeys.reduce((params, fullKey) => ({
      ...params,
      [fullKey]: rndStr(),
    }), {});
    const inputFull = fullKeys
      .map((fullKey) => [
        `--${fullKey}`,
        values[fullKey as keyof typeof values],
      ])
      .flat();
    const inputShort = fullKeys
      .map((fullKey) => [
        `-${list[fullKey]}`,
        values[fullKey as keyof typeof values],
      ])
      .flat();
    const resultFull = getArguments({
      argList: list,
      inputArgv: inputFull,
    });
    const resultShort = getArguments({
      argList: list,
      inputArgv: inputShort,
    });

    expect(resultFull.args).toStrictEqual(values);
    expect(resultShort.args).toStrictEqual(values);
  });

  test('Should auto assign true for arguments without values', () => {
    const values = fullKeys.reduce((params, fullKey) => ({
      ...params,
      [fullKey]: true,
    }), {});
    const inputFull = fullKeys
      .map((fullKey) => `--${fullKey}`)
      .flat();
    const inputShort = fullKeys
      .map((fullKey) => `-${list[fullKey]}`)
      .flat();
    const resultFull = getArguments({
      argList: list,
      inputArgv: inputFull,
    });
    const resultShort = getArguments({
      argList: list,
      inputArgv: inputShort,
    });

    expect(resultFull.args).toStrictEqual(values);
    expect(resultShort.args).toStrictEqual(values);
  });

  test('Should throw error for unknown arguments', () => {
    expect(() => getArguments({
      inputArgv: [`--${rndStr()}`],
      argList: list,
      throwUnsupports: true,
    })).toThrowError();
  });
});
