import { createCook, Recipe } from '..';

describe('createCook', () => {
  const rndStr = () => Math.random().toString();

  test('Should return cook', () => {
    const cook = createCook();
    const str = rndStr();

    expect(typeof cook).toBe('function');
    expect(cook(str)).resolves.toBe(str);
  });

  test('Should work with recipes', async () => {
    const str = rndStr();
    const options = {
      [rndStr()]: rndStr(),
      [rndStr()]: rndStr(),
      [rndStr()]: rndStr(),
    };
    const recipe: Recipe<typeof options> = async (src, raw, opt) => {
      expect(raw).toBe(str);
      expect(opt).toStrictEqual(options);

      return src.replace(/(\d)(\d)(\d)/g, '$2$3$1');
    };
    const cook = createCook(recipe);
    const cnv = await recipe(str, str, options);
    const cookTwice = createCook([
      recipe,
      ((src, ...args) => {
        expect(src).toBe(cnv);

        return recipe(src, ...args);
      }) as Recipe<typeof options>,
    ]);
    const cnvTwice = await recipe(await recipe(str, str, options), str, options);

    expect(cook(str, options)).resolves.toBe(cnv);
    expect(cookTwice(str, options)).resolves.toBe(cnvTwice);
  });
});
