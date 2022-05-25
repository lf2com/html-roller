import { hasQuote } from '..';

describe('hasQuote', () => {
  const rndStr = () => Math.random().toString();

  test('Should return true for string wrapped with \', ", or `', () => {
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
      expect(hasQuote(str)).toBe(true);
    });
  });

  test('Should return false for invalid strings', () => {
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
      expect(hasQuote(str)).toBe(false);
    });
  });
});
