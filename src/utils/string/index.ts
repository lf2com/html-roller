/**
 * Returns true if source is wrapped by quotes.
 */
export function hasQuote(source: string): boolean {
  return /^('[^']*'|"[^"]*"|`[^`]*`)$/.test(source);
}

/**
 * Returns quote wrapping the source.
 */
export function getQuote(source: string): string {
  return hasQuote(source) ? source[0] : '';
}

/**
 * Returns standardized string without wrapping quotes.
 */
export function stdQuoteStr(source: string): string {
  return hasQuote(source) ? source.slice(1, -1) : source;
}

/**
 * Returns URL without extended string.
 */
export function getUrlWithoutExt(source: string): string {
  return source.replace(/[#?][^/]*$/, '');
}

/**
 * Returns true if source is URL alike.
 */
export function isUrlLike(source: string): boolean {
  // simple test
  return (
    /^(https?:|file:\/|wss?:)\/\//i.test(source)
    || /^#/.test(source)
  );
}

/**
 * Returns string with search and replacer in asynchrony.
 */
export async function replaceStrAsync(
  source: string,
  search: string | RegExp,
  replacer: string | ((str: string, ...args: any[]) => string | Promise<string>),
): Promise<string> {
  if (typeof replacer === 'string') {
    return source.replace(search, replacer);
  }

  const promises: Promise<string>[] = [];

  source.replace(search, (...args) => {
    promises.push(
      Promise.resolve(
        replacer(...args),
      ),
    );

    return '';
  });
  const results = await Promise.all(promises);

  return source.replace(search, () => results.shift() as string);
}
