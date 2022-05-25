export type Recipe<O> = (src: string, raw: string, options?: O) => Promise<string>;

export type Cook<O> = (src: string, options?: O) => Promise<string>;

/**
 * Returns a roller function.
 */
export function createCook<O = never>(
  recipes: Recipe<O> | Recipe<O>[] = [],
): Cook<O> {
  const cookRecipes = Array.isArray(recipes) ? recipes : [recipes];

  return async (source, options) => (
    cookRecipes.reduce<Promise<string>>(
      async (prevText, recipe) => {
        const text = await prevText;
        const result = await recipe(text, source, options);

        return result;
      },
      Promise.resolve(source),
    )
  );
}
