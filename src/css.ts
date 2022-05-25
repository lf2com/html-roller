import CleanCss from 'clean-css';
import { RecipeOptionsGeneral, stdRecipeOptions } from '.';
import { createCook, Recipe } from './utils/cook';
import {
  copySync, getAbsPath, getFlatFileName, stdPath,
} from './utils/file';
import { printError } from './utils/log';
import {
  getQuote, getUrlWithoutExt, isUrlLike, replaceStrAsync, stdQuoteStr,
} from './utils/string';

export type CssOptions = CleanCss.OptionsPromise | CleanCss.OptionsOutput;

type CssRecipe = Recipe<RecipeOptionsGeneral>

/**
 * Returns minified CSS text.
 */
export const cssMinifyRecipe: CssRecipe = async (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const { minify, cssOptions } = stdedOptions;

  if (!minify) {
    return source;
  }

  const { errors, styles } = await new CleanCss({
    ...cssOptions,
    returnPromise: true,
  }).minify(source);

  if (errors.length > 0) {
    throw Error(`Failed to minify CSS: ${errors.join('\n')}`);
  }

  return styles;
};

/**
 * Returns cooked CSS URL.
 */
export function cookCssResouce(
  resource: string,
  options?: RecipeOptionsGeneral,
): string {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;
  const resPathWithoutQuota = stdQuoteStr(resource);

  if (isUrlLike(resPathWithoutQuota)) {
    return resource;
  }

  const resPurePath = getUrlWithoutExt(resPathWithoutQuota);
  const resPath = getAbsPath(resPurePath, inputPath);
  const q = getQuote(resource);
  const resNewName = getFlatFileName(
    resPath.replace(basePath, ''),
    { hash: minify },
  );
  const resNewPath = stdPath(outputPath, resNewName);

  try {
    copySync(resPath, resNewPath);

    return [q, resNewName, q].join('');
  } catch (error) {
    const { message, stack } = error as Error;

    printError(`Failed to handle CSS resource: ${message} @${resPurePath}`);
    printError(stack);

    return resource;
  }
}

/**
 * Returns CSS text converted URLs.
 */
export const cssUrlRecipe: CssRecipe = async (source, _, options) => (
  replaceStrAsync(
    source,
    /(\burl\()(.+?)(\))/gm,
    (__, head, resRawPath, tail) => [
      head,
      cookCssResouce(resRawPath, options),
      tail,
    ].join(''),
  )
);

/**
 * Returns CSS text converted import URLs.
 */
export const cssImportRecipe: CssRecipe = async (source, _, options) => (
  replaceStrAsync(
    source,
    /^(\s*@import\s+)(.+?)(\s*;\s*)$/gm,
    (__, head, resRawPath, tail) => [
      head,
      cookCssResouce(resRawPath, options),
      tail,
    ].join(''),
  )
);

/**
 * Returns cooked CSS text.
 */
export const cssRoller = createCook<RecipeOptionsGeneral>(
  [
    cssUrlRecipe,
    cssImportRecipe,
    cssMinifyRecipe,
  ],
);
