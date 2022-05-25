import { getQuote } from '..';

describe('getQuote', () => {
  const rndStr = () => Math.random().toString();

  test('Should return quote of valid strings', () => {
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
      expect(getQuote(str)).toBe(str[0]);
    });
  });

  test('Should return empty string of invalid strings', () => {
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
      expect(getQuote(str)).toBe('');
    });
  });
});
