import { stdQuoteStr } from '..';

describe('stdQuoteStr', () => {
  const rndStr = () => Math.random().toString();

  test('Should unwrap quoted strings', () => {
    [
      `'${rndStr()}'`,
      `"${rndStr()}"`,
      `\`${rndStr()}\``,
      `'${rndStr()}"${rndStr()}'`,
      `'${rndStr()}\`${rndStr()}'`,
      `"${rndStr()}'${rndStr()}"`,
      `"${rndStr()}\`${rndStr()}"`,
      `\`${rndStr()}'${rndStr()}\``,
      `\`${rndStr()}"${rndStr()}\``,
    ].forEach((str) => {
      expect(stdQuoteStr(str)).toBe(str.slice(1, -1));
    });
  });

  test('Should keep the original strings', () => {
    [
      rndStr(),
      `'${rndStr()}"`,
      `'${rndStr()}\``,
      `"${rndStr()}'`,
      `"${rndStr()}\``,
      `\`${rndStr()}'`,
      `\`${rndStr()}"`,
      `${rndStr()}'${rndStr()}`,
      `${rndStr()}"${rndStr()}`,
      `${rndStr()}\`${rndStr()}`,
      `'${rndStr()}'${rndStr()}'`,
      `"${rndStr()}"${rndStr()}"`,
      `\`${rndStr()}\`${rndStr()}\``,
    ].forEach((str) => {
      expect(stdQuoteStr(str)).toBe(str);
    });
  });
});
